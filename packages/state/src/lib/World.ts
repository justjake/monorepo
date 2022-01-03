import { createStore, Store } from 'jotai';
import { jotaiStoreCapabilities } from './implicitCapabilities';
import { ChangeSubscriber, ScheduleFn, Scheduler } from './Scheduler';
import * as ReactDOM from 'react-dom';

export class World {
  readonly store: Store;
  readonly capabilities: ReturnType<typeof jotaiStoreCapabilities>;
  readonly scheduler: Scheduler;
  readonly changeSubscriber: ChangeSubscriber;

  constructor(
    private config: {
      onError: (error: unknown) => void;
      scheduleFlush: ScheduleFn;
      batchEffects: ScheduleFn;
    }
  ) {
    this.store = createStore();
    this.capabilities = jotaiStoreCapabilities(this.store);
    this.scheduler = new Scheduler(this.config);
    this.changeSubscriber = new ChangeSubscriber({
      capabilities: this.capabilities,
      scheduleCompute: this.scheduler.scheduleCompute,
      scheduleEffect: this.scheduler.scheduleEffect,
    });
  }

  static syncWorld() {
    return new this({
      batchEffects: (effects) => effects(),
      scheduleFlush: (flush) => flush(),
      onError(error) {
        throw error;
      },
    });
  }

  static reactWorld() {
    const scheduleFlush: ScheduleFn =
      typeof window === 'object'
        ? window.requestAnimationFrame
        : (flush) => flush();
    const onError =
      typeof window === 'object'
        ? (error: unknown) => {
            // Browser: throw async. This should reach the developer console, but
            // not block the compute queue.
            new Promise((resolve, reject) => reject(error));
          }
        : (error: unknown) => {
            throw error;
          };
    return new this({
      batchEffects: ReactDOM.unstable_batchedUpdates,
      scheduleFlush,
      onError,
    });
  }
}
