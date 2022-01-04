import { atom, Atom, Getter, Setter } from 'jotai';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { callWithCapability } from '..';
import { World } from './World';

type AnyAtom = Atom<unknown>;

const WorldContext = React.createContext<World | undefined>(undefined);

/**
 * Provide a World to class-based Jotai components.
 */
export const WorldProvider = WorldContext.Provider;

type RunAction = <R>(perform: (get: Getter, set: Setter) => R) => R;

/**
 * Props provided to class-based Jotai components by `classComponentWithJotai`.
 */
export type WithJotaiProps = {
  /** Get state of atom, and possibly subscribe to it */
  get: Getter;
  /** Perform an action */
  act: RunAction;
  /** Forces a re-render of pure components */
  _revision: number;
  /** Used to make render reactive */
  _render: (render: () => React.ReactNode) => React.ReactNode;
};

/**
 * Higher order component that wraps a class component's `render` method to make
 * it more reactive.
 *
 * These components require a <WorldProvider> to be present in the component tree.
 *
 * Status: crazy, untested idea.
 */
export function classComponentWithJotai<
  Props,
  ComponentT extends React.Component<Props & WithJotaiProps>
>(
  Component: React.ComponentClass<Props & WithJotaiProps>,
  displayName?: string
): React.FunctionComponent<Omit<Props, keyof WithJotaiProps>> {
  // Wrap the render method to make it reactive.
  if (!(typeof Component.prototype.render === 'function')) {
    throw new Error(
      'Component must have a render method on its prototype we can make reactive'
    );
  }

  class ReactiveSubclass extends Component {
    override render() {
      return this.props._render(() => super.render());
    }
  }

  Object.defineProperty(ReactiveSubclass, 'name', {
    value: displayName ?? Component.name,
    configurable: true,
    writable: false,
    enumerable: false,
  });

  const WrappedComponent = React.forwardRef(
    (props: Props, ref: React.Ref<ComponentT>) => {
      const world = React.useContext(WorldContext);
      if (!world) {
        throw new Error(
          "Can't use classComponentWithJotai without a WorldProvider"
        );
      }

      const [revision, setRevision] = useState(0);
      const mounted = useRef(true);
      const iteration = useRef(0);
      const rendering = useRef(false);
      const subscriptions = useRef(
        new Map<AnyAtom, { iteration: number; unsubscribe: () => void }>()
      );

      const forceRender = useCallback(() => {
        if (mounted.current) {
          setRevision((r) => r + 1);
        }
      }, []);

      const getAndSubscribe = useCallback(
        function <T>(atom: Atom<T>): T {
          const subscription = subscriptions.current.get(atom) || {
            iteration: iteration.current,
            unsubscribe: world.changeSubscriber.subscribeChangeEffect(
              atom,
              forceRender
            ),
          };
          subscription.iteration = iteration.current;
          subscriptions.current.set(atom, subscription);

          return world.capabilities.get(atom);
        },
        [world, forceRender]
      );

      const getAtom: Getter = useCallback(
        (atom: AnyAtom) => {
          if (rendering.current && mounted.current) {
            return getAndSubscribe(atom);
          } else {
            return world.capabilities.get(atom);
          }
        },
        [getAndSubscribe, world]
      );

      const act: RunAction = useCallback(
        function <R>(perform: (getter: Getter, setter: Setter) => R): R {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let result: any;
          const writeOnlyAtom = atom(
            () => undefined,
            (get, set) => {
              result = callWithCapability({ get, set }, () =>
                perform(get, set)
              );
            }
          );
          world.capabilities.set(writeOnlyAtom, undefined);
          return result;
        },
        [world]
      );

      const _render = useCallback(
        (renderFn: () => React.ReactNode) => {
          rendering.current = true;
          iteration.current++;
          try {
            const result = callWithCapability({ get: getAtom }, renderFn);
            for (const [atom, subscription] of subscriptions.current) {
              if (subscription.iteration !== iteration.current) {
                subscription.unsubscribe();
                subscriptions.current.delete(atom);
              }
            }
            return result;
          } finally {
            rendering.current = false;
          }
        },
        [getAtom]
      );

      useEffect(() => {
        const res = () => {
          mounted.current = false;
          // eslint-disable-next-line react-hooks/exhaustive-deps
          for (const { unsubscribe } of subscriptions.current.values()) {
            unsubscribe();
          }
        };
        return res;
      }, []);

      const enhancedProps: WithJotaiProps = {
        get: getAtom,
        act,
        _revision: revision,
        _render,
      };

      return <ReactiveSubclass {...props} {...enhancedProps} ref={ref} />;
    }
  );

  const componentDisplayName =
    displayName || `withJotaiState(${Component.displayName || Component.name})`;
  WrappedComponent.displayName = componentDisplayName;
  Object.defineProperty(WrappedComponent, 'name', {
    value: componentDisplayName,
    configurable: true,
    enumerable: false,
    writable: false,
  });

  return WrappedComponent as any;
}
