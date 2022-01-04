import { mapGetOrCreate } from '@jitl/util';
import { Atom } from 'jotai';
import { ReadCapability, SubscribeCapability } from '..';

type AnyAtom = Atom<unknown>;
type Effect = () => void;

// Eg, setTimeout(() => {}, 0);
export type ScheduleFn = (effect: Effect) => void;

interface SchedulerConfig {
  scheduleCompute: ScheduleFn;
  scheduleEffect: ScheduleFn;
  capabilities: ReadCapability & SubscribeCapability;
}

class AtomChangeSubscription {
  prev: unknown;
  unsubscribe: Effect;
  listeners = new Set<Effect>();
  constructor(public atom: AnyAtom, public config: SchedulerConfig) {
    this.prev = this.config.capabilities.get(atom);
    this.unsubscribe = this.config.capabilities.subscribe(
      atom,
      this.handleAtomMaybeChange
    );
  }
  recompute = () => {
    const cur = this.config.capabilities.get(this.atom);
    if (!Object.is(cur, this.prev)) {
      this.prev = cur;
      this.listeners.forEach(this.config.scheduleEffect);
    }
  };
  handleAtomMaybeChange = () => {
    this.config.scheduleCompute(this.recompute);
  };
}

export class ChangeSubscriber {
  private subscriptions = new Map<AnyAtom, AtomChangeSubscription>();
  constructor(private config: SchedulerConfig) {}

  subscribeChangeEffect(atom: AnyAtom, callback: Effect): () => void {
    const changeTracker = mapGetOrCreate(this.subscriptions, atom, () => {
      const t = new AtomChangeSubscription(atom, this.config);
      this.config.capabilities.subscribe(atom, t.handleAtomMaybeChange);
      return t;
    }).value;

    changeTracker.listeners.add(callback);

    return () => {
      changeTracker.listeners.delete(callback);
      if (changeTracker.listeners.size === 0) {
        changeTracker.unsubscribe();
        this.subscriptions.delete(atom);
      }
    };
  }

  getSubscribedAtoms(): IterableIterator<AnyAtom> {
    return this.subscriptions.keys();
  }
}

export class Scheduler {
  private readonly computeQueue = new Set<Effect>();
  private readonly effectQueue = new Set<Effect>();
  private queued = false;

  constructor(
    private config: {
      scheduleFlush: ScheduleFn;
      batchEffects: ScheduleFn;
      onError: (error: unknown) => void;
    }
  ) {
    this.config = config;
  }

  scheduleCompute: SchedulerConfig['scheduleCompute'] = (effect) => {
    this.computeQueue.add(effect);
    this.enqueue();
  };

  scheduleEffect: SchedulerConfig['scheduleEffect'] = (effect) => {
    this.effectQueue.add(effect);
    this.enqueue();
  };

  flush = () => {
    do {
      const toCompute = [...this.computeQueue];
      this.computeQueue.clear();
      for (const effect of toCompute) {
        try {
          effect();
        } catch (error) {
          this.config.onError(error);
        }
      }

      const effects = [...this.effectQueue];
      this.effectQueue.clear();
      this.config.batchEffects(() => {
        for (const effect of effects) {
          try {
            effect();
          } catch (error) {
            this.config.onError(error);
          }
        }
      });
    } while (this.computeQueue.size > 0 || this.effectQueue.size > 0);
    this.queued = false;
  };

  enqueue() {
    if (!this.queued) {
      this.queued = true;
      this.config.scheduleFlush(this.flush);
    }
  }
}
