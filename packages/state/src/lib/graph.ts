/**
 * Jotai-inspired state graph, but without most of the React-specific complexity.
 */

import { unreachable } from '@jitl/util';

export type Effect = () => void;
export type Getter = <T>(node: Config<T>) => T;
export type Setter = <T>(node: WritableConfig<T>, value: T) => void;

const PRIMITIVE = 0 as const;
const COMPUTED = 1 as const;
const COMPUTED_ERROR = 2 as const;
const COMPUTED_VALUE = 3 as const;

class Subscribers {
  effects = new Set<Effect>();
  dependents = new Set<AnyConfig>();
}

function subscribersEmpty(subscribers: Subscribers): boolean {
  return !(subscribers?.dependents?.size || subscribers?.effects?.size);
}

/** Tracks dependency's revision */
type Dependency = number | GetEvent;

function getSnapshotRevision(a: Dependency): number {
  if (typeof a === 'number') {
    return a;
  }

  return a.state?.revision ?? 0;
}

type Dependencies = Map<AnyConfig, Dependency>;

interface BaseState {
  revision: number;
  invalidated: number;
  dependencies: Dependencies | undefined;
}

class PrimitiveState<T> implements BaseState {
  public t = PRIMITIVE;
  public invalidated = -1;
  declare dependencies: Dependencies | undefined;
  constructor(public revision: number, public value: T) {}
}

class ComputedErrorState implements BaseState {
  public t = COMPUTED_ERROR;
  public invalidated = -1;
  constructor(
    public revision: number,
    public error: unknown,
    public dependencies: Dependencies
  ) {}
}
class ComputedValueState<T> implements BaseState {
  public t = COMPUTED_VALUE;
  public invalidated = -1;
  constructor(
    public revision: number,
    public value: T,
    public dependencies: Dependencies
  ) {}
}

function invalidated<T>(
  state: PrimitiveState<T>,
  invalidated: number
): PrimitiveState<T>;
function invalidated<T>(
  state: ComputedErrorState,
  invalidated: number
): ComputedErrorState;
function invalidated<T>(
  state: ComputedValueState<T>,
  invalidated: number
): ComputedValueState<T>;
function invalidated<T>(state: State<T>, invalidated: number): State<T>;
function invalidated<T>(state: State<T>, invalidated: number): State<T> {
  if (state.invalidated === invalidated) {
    return state;
  }

  let newState: State<T>;

  if (state.t === PRIMITIVE) {
    newState = new PrimitiveState(state.revision, state.value);
  } else if (state.t === COMPUTED_VALUE) {
    newState = new ComputedValueState(
      state.revision,
      state.value,
      state.dependencies
    );
  } else if (state.t === COMPUTED_ERROR) {
    newState = new ComputedErrorState(
      state.revision,
      state.error,
      state.dependencies
    );
  } else {
    unreachable(state);
  }

  newState.invalidated = invalidated;
  return newState;
}

class PrimitiveNodeConfig<T> {
  readonly t = PRIMITIVE;
  constructor(
    public getInitialValue: () => T,
    public equal?: (before: T, after: T) => boolean
  ) {}
}

export function primitive<T>(
  getInitialState: () => T,
  equal?: (before: T, after: T) => boolean
): PrimitiveNodeConfig<T> {
  return new PrimitiveNodeConfig(getInitialState, equal);
}

class ComputedNodeConfig<T> {
  readonly t = COMPUTED;
  constructor(
    public compute: (get: Getter) => T,
    public equal?: (before: T, after: T) => boolean
  ) {}
}

export function computed<T>(
  compute: (get: Getter) => T,
  equal?: (before: T, after: T) => boolean
): ComputedNodeConfig<T> {
  return new ComputedNodeConfig(compute, equal);
}

type ComputedState<T> = ComputedValueState<T> | ComputedErrorState;
type State<T> = PrimitiveState<T> | ComputedState<T>;
type WritableConfig<T> = PrimitiveNodeConfig<T>;
type AnyState = State<unknown>;
type Config<T> = PrimitiveNodeConfig<T> | ComputedNodeConfig<T>;
type AnyConfig = Config<unknown>;

class GraphState {
  readonly states = new WeakMap<AnyConfig, AnyState>();
  readonly mounted = new WeakMap<AnyConfig, Subscribers>();
  readonly pendingPrev = new Map<AnyConfig, AnyState | undefined>();
  readonly mountedSet: Set<AnyConfig> | undefined;
  constructor(debugMode = false) {
    if (debugMode) {
      this.mountedSet = new Set();
    }
  }
}

class BaseEvent {
  stack: string[];
  constructor() {
    try {
      throw Error();
    } catch (error) {
      this.stack = (error as Error).stack?.split('\n') || [];
    }
  }
}

class WriteTxEvent extends BaseEvent {
  type = 'write' as const;
  events: Array<SetEvent> = [];
}

class SetEvent extends BaseEvent {
  type = 'set' as const;
  constructor(public node: WritableConfig<unknown>, public value: unknown) {
    super();
  }
}

/** Emitted whenever a node is read by another node */
class GetEvent extends BaseEvent {
  constructor(public node: AnyConfig, public state: AnyState | undefined) {
    super();
  }
}

class WillRecomputeEvent extends BaseEvent {
  constructor(public node: AnyConfig, public reason: AnyConfig | undefined) {
    super();
  }
}

type DebugEvent = WriteTxEvent | SetEvent | GetEvent | WillRecomputeEvent;

// TODO: consider turning this class into module-private functions.
class Graph {
  graph: GraphState;
  debugEventHandlers?: Set<(event: DebugEvent) => void>;

  constructor(public debug = false) {
    this.graph = new GraphState(debug);
  }

  // Debugging

  private dispatchDebugEvent(event: DebugEvent) {
    if (this.debug && this.debugEventHandlers) {
      this.debugEventHandlers.forEach((handler) => handler(event));
    }
  }

  subscribeToDebugEvents(callback: (event: DebugEvent) => void): Effect {
    if (!this.debug) {
      throw new Error('debug not supported');
    }

    if (!this.debugEventHandlers) {
      this.debugEventHandlers = new Set([callback]);
    } else {
      this.debugEventHandlers.add(callback);
    }

    return () => {
      this.debugEventHandlers?.delete(callback);
    };
  }

  // Fundamentals

  public readWithoutSubscribing<T>(fn: (get: Getter) => T): T;
  public readWithoutSubscribing<T>(node: Config<T>): T;
  public readWithoutSubscribing<T>(from: Config<T> | ((get: Getter) => T)): T {
    if (typeof from === 'function') {
      return this.readTransaction(from);
    }

    const state = this.getNextState(from);
    if (state.t === COMPUTED_ERROR) {
      throw state.error;
    }
    return state.value;
  }

  public write<T>(fn: (get: Getter, set: Setter) => T): T;
  public write<T>(node: WritableConfig<T>, newValue: T): T;
  public write<T>(
    to: WritableConfig<T> | ((get: Getter, set: Setter) => T),
    newValue?: T
  ): T {
    if (typeof to === 'function') {
      return this.writeTransaction(to);
    }

    if (to.t !== PRIMITIVE) {
      throw new TypeError('Not writable');
    }

    this.setNodeValueIfChanged(to, newValue as T);
    this.invalidateAllDependents(to as AnyConfig);
    this.flushPending();
    return newValue as T;
  }

  public subscribeToInvalidation<T>(node_: Config<T>, effect: Effect): Effect {
    const node = node_ as AnyConfig;
    let mounted = this.graph.mounted.get(node);
    if (!mounted) {
      mounted = this.mountNode(node, undefined);
    }
    mounted.effects.add(effect);

    const closureSubscribers = mounted;
    return () => {
      closureSubscribers.effects.delete(effect);
      const currentSubscribers = this.graph.mounted.get(node);
      if (currentSubscribers && subscribersEmpty(currentSubscribers)) {
        this.unmountNode(node);
      }
    };
  }

  // Private

  private readTransaction<T>(tx: (get: Getter) => T): T {
    return tx(this.writeGetter);
  }

  private writeTransaction<T>(tx: (get: Getter, set: Setter) => T): T {
    const txEvent = this.debug && new WriteTxEvent();
    const writeSetter: Setter = this.debug
      ? (node, val) => {
          txEvent &&
            txEvent.events.push(
              new SetEvent(node as WritableConfig<unknown>, val)
            );
          this.writeSetter(node, val);
        }
      : this.writeSetter;
    try {
      return tx(this.writeGetter, writeSetter);
    } finally {
      this.flushPending();
    }
  }

  private writeSetter: Setter = (node, newValue) => {
    this.setNodeValueIfChanged(node, newValue);
    this.invalidateAllDependents(node as AnyConfig);
  };

  private writeGetter: Getter = (node) => {
    const state = this.getNextState(node);
    if (state.t === COMPUTED_ERROR) {
      throw state.t;
    }
    return state.value;
  };

  private getCurrentState<T>(node: Config<T>): State<T> | undefined {
    return this.graph.states.get(node as AnyConfig) as State<T> | undefined;
  }

  private getNextState<T>(node: Config<T>): State<T> {
    const state = this.getCurrentState(node);
    if (state && state.t === PRIMITIVE) {
      return state;
    }

    let recomputeReason: AnyConfig | undefined;

    if (state && (state.t === COMPUTED_ERROR || state.t === COMPUTED_VALUE)) {
      // Recompute any dependencies that have been invalidated
      for (const [dep] of state.dependencies) {
        if (dep === node) {
          // We are already recomputing.
          continue;
        }

        if (!this.graph.mounted.has(dep)) {
          // Dependency is new or unmounted.
          // Invalidation doesn't touch unmounted atoms, so we need to recurse
          // into this dependency in case it needs to update.
          this.getNextState(dep);
        } else {
          const depState = this.getCurrentState(dep);
          if (depState && depState.revision === depState.invalidated) {
            // Recompute invalidated.
            this.getNextState(dep);
          }
        }
      }

      // If any dependency revision changed since we subscribed, then we need to recompute.
      let recomputeEvent: WillRecomputeEvent | undefined;
      for (const [dep, snapshot] of state.dependencies) {
        const depState = this.getCurrentState(dep);
        if (
          !depState ||
          depState.revision !== getSnapshotRevision(snapshot) ||
          depState.t === COMPUTED_ERROR
        ) {
          recomputeReason = dep;
          break;
        }
      }

      if (!recomputeReason) {
        return state;
      }
    }

    // Compute a new state for this node.

    if (this.debug) {
      this.dispatchDebugEvent(
        new WillRecomputeEvent(node as AnyConfig, recomputeReason)
      );
    }

    switch (node.t) {
      case PRIMITIVE: {
        try {
          const value = node.getInitialValue();
          return this.setNodeValueIfChanged(node, value);
        } catch (error) {
          return this.setNodeError(node, error);
        }
      }

      case COMPUTED: {
        const nextDependencies: Dependencies = new Map();
        try {
          const value = node.compute((dep) => {
            const node_ = node as AnyConfig;
            if (dep !== node_) {
              this.snapshot(nextDependencies, dep as AnyConfig);
            }
            const depState =
              dep === node_
                ? this.getCurrentState(dep)
                : this.getNextState(dep);

            switch (depState?.t) {
              case undefined:
                throw new Error(
                  dep === node_
                    ? 'Computed is recursively reading itself, but no value is available yet.'
                    : 'Computed dependency has not been computed yet.'
                );

              case COMPUTED_VALUE:
              case PRIMITIVE:
                return depState.value;

              case COMPUTED_ERROR:
                throw depState.error;

              default:
                unreachable(depState);
            }
          });
          return this.setNodeValueIfChanged(node, value, nextDependencies);
        } catch (error) {
          return this.setNodeError(node, error, nextDependencies);
        }
      }

      default:
        return unreachable(node);
    }
  }

  private setNodeValueIfChanged<T>(
    node: Config<T>,
    value: T,
    dependencies?: Dependencies
  ): State<T> {
    let nextRevision = 0;

    const state = this.getCurrentState(node);
    if (state) {
      if (state.t === PRIMITIVE || state.t === COMPUTED_VALUE) {
        const isEqual = node.equal ?? Object.is;
        if (isEqual(state.value, value)) {
          // No change.
          return state;
        }
      }

      nextRevision = state.revision + 1;
    }

    const nextState =
      node.t === PRIMITIVE
        ? new PrimitiveState(nextRevision, value)
        : new ComputedValueState(
            nextRevision,
            value,
            this.createReadDependencies(dependencies, state?.dependencies)
          );

    return this.setNodeState(node, nextState);
  }

  private setNodeState<T>(node: Config<T>, nextState: State<T>): State<T> {
    // TODO: freeze nextState?
    const node_ = node as AnyConfig;

    if (!this.graph.pendingPrev.has(node_)) {
      this.graph.pendingPrev.set(node_, this.getCurrentState(node_));
    }
    this.graph.states.set(node_, nextState);
    return nextState;
  }

  private setNodeError<T>(
    node: Config<T>,
    error: unknown,
    dependencies?: Dependencies
  ): State<T> {
    let nextRevision = 0;

    const state = this.getCurrentState(node);
    if (state) {
      nextRevision = state.revision + 1;
    }

    const nextState = new ComputedErrorState(
      nextRevision,
      error,
      this.createReadDependencies(dependencies, state?.dependencies)
    );
    return this.setNodeState(node, nextState);
  }

  private createReadDependencies(
    dependencies: Dependencies | undefined,
    prev: Dependencies | undefined
  ): Dependencies {
    if (!dependencies) {
      return prev ?? new Map();
    }

    let changed = !prev || prev.size !== dependencies.size;

    // Create a new dependency object so that if the computed store somehow
    // retained the `get` function, it doesn't continue to add dependencies.
    const newDependencies: Dependencies = new Map();
    for (const dep of dependencies.keys()) {
      // Get the latest revision number.
      const snapshot = this.snapshot(dependencies, dep);
      newDependencies.set(dep, snapshot);
      if (!changed && prev) {
        const prevSnapshot = prev.get(dep);
        changed =
          getSnapshotRevision(snapshot) !==
          (prevSnapshot && getSnapshotRevision(prevSnapshot));
      }
    }

    if (!changed) {
      // prev should always exist, but the type system doesn't know that.
      return prev ?? new Map();
    }

    return newDependencies;
  }

  private snapshot(dependencies: Dependencies, node: AnyConfig): Dependency {
    const prevState = this.getCurrentState(node);
    const revision = prevState?.revision ?? 0;
    if (!this.debug) {
      dependencies.set(node, revision);
      return revision;
    }

    const existing = dependencies.get(node);
    if (typeof existing === 'object') {
      existing.state = prevState;
      return existing;
    }

    const event = new GetEvent(node, prevState);
    dependencies.set(node, event);
    return event;
  }

  private invalidateAllDependents(node: AnyConfig) {
    const subscribers = this.graph.mounted.get(node);
    if (!subscribers) {
      return;
    }
    for (const subscriber of subscribers.dependents) {
      const subscriberState = this.getCurrentState(subscriber);
      if (subscriberState) {
        const nextState = invalidated(
          subscriberState,
          subscriberState.revision
        );
        this.setNodeState(subscriber, nextState);
      } else {
        console.warn('Trying to invalidate non-existent node.');
      }
      this.invalidateAllDependents(subscriber);
    }
  }

  private flushPending() {
    const pending = Array.from(this.graph.pendingPrev);
    this.graph.pendingPrev.clear();
    for (const [node, prevState] of pending) {
      const nextState = this.getCurrentState(node);
      if (nextState && nextState.dependencies !== prevState?.dependencies) {
        this.mountOrUnmountDependencies(
          node,
          nextState,
          prevState?.dependencies
        );
      }
      const effects = this.graph.mounted.get(node)?.effects;
      if (effects) {
        for (const effect of effects) {
          effect();
        }
      }
    }
  }

  private mountOrUnmountDependencies(
    node: AnyConfig,
    nextState: AnyState,
    prevDeps: Dependencies | undefined
  ) {
    const newDependencies: Set<AnyConfig> =
      nextState.t === PRIMITIVE
        ? new Set()
        : new Set(nextState.dependencies.keys());

    if (prevDeps) {
      for (const dep of prevDeps.keys()) {
        // Continues to be a dependency.
        if (newDependencies.has(dep)) {
          newDependencies.delete(dep);
          continue;
        }

        // Dependency was removed.
        const depSubscribers = this.graph.mounted.get(dep);
        if (depSubscribers) {
          depSubscribers.dependents.delete(node);

          // If this is the last dependency of `dep`, then it should be unmounted.
          if (subscribersEmpty(depSubscribers)) {
            this.unmountNode(dep);
          }
        }
      }
    }

    for (const dep of newDependencies) {
      if (this.graph.mounted.has(dep)) {
        this.graph.mounted.get(dep)?.dependents.add(node);
      } else {
        this.mountNode(dep, node);
      }
    }
  }

  private mountNode(node: AnyConfig, initialDependent: AnyConfig | undefined) {
    // Mount self.
    const subscribers = new Subscribers();
    if (initialDependent) {
      subscribers.dependents.add(initialDependent);
    }
    this.graph.mounted.set(node, subscribers);
    if (this.graph.mountedSet) {
      this.graph.mountedSet.add(node);
    }

    // Recompute self to mount our dependencies.
    const nextState = this.getNextState(node);
    if (nextState.dependencies) {
      for (const dep of nextState.dependencies.keys()) {
        const mounted = this.graph.mounted.get(dep);
        if (mounted) {
          mounted.dependents.add(node);
        } else if (dep !== node) {
          this.mountNode(dep, node);
        }
      }
    }

    // TODO: jotai calls onMount here.
    return subscribers;
  }

  private unmountNode(node: AnyConfig) {
    // TODO: jotai calls onMount's cleanup here

    // Unmount self.
    this.graph.mounted.delete(node);
    this.graph.mountedSet?.delete(node);

    // Unmount previous dependencies
    const prevState = this.getCurrentState(node);
    if (prevState?.dependencies) {
      for (const dep of prevState.dependencies.keys()) {
        if (dep === node) {
          continue;
        }

        const depSubscribers = this.graph.mounted.get(dep);
        if (depSubscribers) {
          depSubscribers.dependents.delete(node);
          if (subscribersEmpty(depSubscribers)) {
            this.unmountNode(dep);
          }
        }
      }
    }

    if (!prevState) {
      console.warn('Bug: unmounting atom with no previous state.');
    }
  }
}
