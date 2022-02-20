import styled from '@emotion/styled';
import { useAtomsDevtools } from 'jotai/devtools';
import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';
import { computedAtom, implicitAtom } from '@jitl/state';

const StyledApp = styled.div`
  // Your style here
`;

const helloAtom = atom('hello');
const worldAtom = atom('world');
const capitalize = atom(null, (get, set) => {
  set(worldAtom, get(worldAtom).toUpperCase());
  set(helloAtom, get(helloAtom).toUpperCase());
});
const computed = atom((get) => `${get(helloAtom)} to the ${get(worldAtom)}`);

export function App() {
  useAtomsDevtools('World');
  const [hello, setHello] = useAtom(helloAtom);
  const [, setCapitalize] = useAtom(capitalize);
  const [world] = useAtom(worldAtom);
  const [computedState] = useAtom(computed);

  useEffect(() => {
    setTimeout(() => {
      setHello('goodbye');
    }, 50);

    setTimeout(setCapitalize, 100);
  }, [setHello, setCapitalize]);

  return (
    <StyledApp>
      {hello} {world}; {computedState}
    </StyledApp>
  );
}

export default App;
