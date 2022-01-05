import {
  getByText,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { atom, WritableAtom } from 'jotai';
import { ChangeEventHandler, Component } from 'react';
import { act } from 'react-dom/test-utils';
import { classComponentWithJotai, WithJotaiProps } from './withJotaiState';
import { World } from './World';
import { WorldProvider } from './WorldProvider';

const name = atom('jake');
const capitalizedName = atom(
  (get) => get(name).toUpperCase(),
  (get, set, str: string) => set(name, str)
);

class ClassBasedComponent extends Component<
  WithJotaiProps & { nameAtom: WritableAtom<string, string, void> }
> {
  override render() {
    return (
      <div>
        Hello{' '}
        <input
          title="name"
          value={this.props.get(this.props.nameAtom)}
          onChange={this.onInputChange}
        />
      </div>
    );
  }

  onInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    this.props.act((get, set) => set(this.props.nameAtom, event.target.value));
  };
}

const WrappedComponent = classComponentWithJotai(ClassBasedComponent);

it('requires World provider', () => {
  // Error.
  expect(() => render(<WrappedComponent nameAtom={name} />)).toThrowError(
    /WorldProvider/
  );

  // Ok.
  const world = World.syncWorld();
  render(
    <WorldProvider value={world}>
      <WrappedComponent nameAtom={name} />
    </WorldProvider>
  );
});

it('rerenders when atom changes', async () => {
  const world = World.syncWorld();
  render(
    <WorldProvider value={world}>
      <WrappedComponent nameAtom={name} />
    </WorldProvider>
  );
  expect(Array.from(world.changeSubscriber.getSubscribedAtoms())).toEqual([
    name,
  ]);
  act(() => world.capabilities.set(name, 'nora'));
  await waitFor(() => screen.getByDisplayValue('nora'));
});

it('rerenders when derived atom changes', async () => {
  const world = World.syncWorld();
  render(
    <WorldProvider value={world}>
      <WrappedComponent nameAtom={capitalizedName} />
    </WorldProvider>
  );
  act(() => world.capabilities.set(name, 'nora'));
  await waitFor(() => screen.getByDisplayValue('NORA'));
});

it('can change atoms', () => {
  const world = World.syncWorld();
  render(
    <WorldProvider value={world}>
      <WrappedComponent nameAtom={name} />
    </WorldProvider>
  );

  userEvent.type(screen.getByTitle('name'), ' tl');

  expect(world.capabilities.get(name)).toBe('jake tl');
});

it('does not leak effects', async () => {
  const leaky = atom('leaky');
  const world = World.syncWorld();
  const { unmount } = render(
    <WorldProvider value={world}>
      <WrappedComponent nameAtom={leaky} />
    </WorldProvider>
  );
  await waitFor(() => screen.getByTitle('name'));
  unmount();

  expect(Array.from(world.changeSubscriber.getSubscribedAtoms())).toEqual([]);
});
