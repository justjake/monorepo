import { Provider } from 'jotai';
import { createContext, useCallback, useContext } from 'react';
import { World } from './World';

const WorldContext = createContext<World | undefined>(undefined);

/** Use the current world */
export function useWorld() {
  const world = useContext(WorldContext);
  if (!world) {
    throw new Error('useWorld must be used within a WorldProvider');
  }
  return world;
}

/** Provide a World via React context. Provides the world's Jotai store to Jotai consumers. */
export function WorldProvider({
  children,
  value: world,
}: {
  children: React.ReactNode;
  value: World;
}) {
  const getStore = useCallback(() => world.store, [world.store]);

  return (
    <WorldContext.Provider value={world}>
      <Provider unstable_createStore={getStore}>{children}</Provider>
    </WorldContext.Provider>
  );
}
