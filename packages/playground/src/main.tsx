import { enterTopLevelCapability, World, WorldProvider } from '@jitl/state';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';

// We need a dynamic process variable for Jotai devtools:
// `process.env` will be compiled to a raw object literal
const DYNAMIC_PROCESS_ENV = process.env;
const DYNAMIC_PROCESS = { env: DYNAMIC_PROCESS_ENV };
Object.freeze(DYNAMIC_PROCESS);
Object.defineProperty(globalThis, 'process', {
  value: DYNAMIC_PROCESS,
  writable: false,
  configurable: false,
  enumerable: true,
});

const world = World.reactWorld();
enterTopLevelCapability(world.capabilities);

console.log('process', process.env);
console.log('process.env', process.env);

async function main() {
  const { App } = await import('./app/app');

  ReactDOM.render(
    <StrictMode>
      <WorldProvider value={world}>
        <App />
      </WorldProvider>
    </StrictMode>,
    document.getElementById('root')
  );
}

main();
