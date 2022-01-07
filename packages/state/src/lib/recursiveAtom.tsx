import { memoizeWithLRU, memoizeWithWeakMap } from '@jitl/util';
import { Atom, atom, useAtom, WritableAtom } from 'jotai';
import { atomFamily, selectAtom } from 'jotai/utils';

type AnyAtom = Atom<unknown>;

type RecurseAny = <I, O>(
  initialValue: I,
  key: (value: I) => unknown,
  transform: Transform<I, O>
) => WritableRecursiveAtom<I, O>;

type Transform<I, O> = (
  initial: I,
  recursiveAtomChild: RecurseAny,
  self: Transform<I, O>
) => O;

type WritableRecursiveAtom<I, O> = WritableAtom<O, O, void>; /* & {
  TODO: how can we support unwrapping this back to the original input type?
  unwrapped: Atom<I>;
}; */

function recursiveAtomRoot<T, O>(
  initialValue: T,
  key: (value: T) => unknown,
  transform: Transform<T, O>
): WritableRecursiveAtom<T, O> {
  const cache = new Map<unknown, AnyAtom>();
  const recurse: RecurseAny = (initialValue, getKey, innerTransform) => {
    const key = getKey(initialValue);
    const cached = cache.get(key);
    if (cached) {
      return cached as any;
    }

    const newAtom = atom(innerTransform(initialValue, recurse, innerTransform));
    cache.set(key, newAtom);
    return newAtom;
  };
  return recurse(initialValue, key, transform);
}
/** Example recursive tree */
interface ExampleNode {
  id: string;
  value?: string;
  children?: ExampleNode[];
  editedBy?: Array<ExampleUser>;
}

interface ExampleUser {
  name: string;
  email: string;
}

interface ExampleNodeR {
  id: string;
  value?: string;
  children?: Array<Atom<ExampleNodeR>>;
  editedBy?: Array<Atom<ExampleUser>>;
}

const DATA: ExampleNode = {
  id: 'root',
  value: 'hello',
  children: [
    {
      id: 'child1',
      children: [
        {
          id: 'grandchild1',
          value: 'blue',
        },
      ],
    },
  ],
};

const root = recursiveAtomRoot<ExampleNode, ExampleNodeR>(
  DATA,
  (it) => it.id,
  (data, recursiveChild, exampleNodeTransform) => {
    return {
      ...data,
      children: data.children?.map((child) =>
        recursiveChild(child, (it) => it.id, exampleNodeTransform)
      ),
      editedBy: data.editedBy?.map((user) =>
        recursiveChild(
          user,
          (it) => it.email,
          (it) => it
        )
      ),
    };
  }
);

// Another tactic
class Normalizer {
  normalizeToFamily<T, O extends AnyAtom>(
    value: T,
    atomFamily: (value: T) => O
  ): O {}
}

function NodeRender(props: { nodeAtom: Atom<ExampleNodeR> }) {
  const { nodeAtom } = props;

  return (
    <div>
      <span>{nodeId}</span>
      <span>{nodeValue}</span>
      <ul>
        {children.map((childAtom) => (
          <li key={index}>
            <NodeRender nodeAtom={nodeChildAt(nodeAtom, index)} />
          </li>
        ))}
      </ul>
    </div>
  );
}
