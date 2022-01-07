import styled from '@emotion/styled';
import { useAtomsDevtools } from 'jotai/devtools';
import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';
import { computedAtom, implicitAtom } from '@jitl/state';

const StyledApp = styled.div`
  // Your style here
`;

const helloAtom = implicitAtom(() => 'hello');
const worldAtom = implicitAtom(() => 'world');
const computed = computedAtom(
  () => `${helloAtom.state} to the ${worldAtom.state}`
);

export function App() {
  useAtomsDevtools('World');
  const [hello, setHello] = useAtom(helloAtom);
  const [world] = useAtom(worldAtom);
  const [computedState] = useAtom(computed);

  useEffect(() => {
    setTimeout(() => {
      setHello('HELLO');
    }, 50);
  }, [setHello]);

  return (
    <StyledApp>
      {hello} {world}; {computedState}
    </StyledApp>
  );
}

export default App;
