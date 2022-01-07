import { mapMustGet } from '..';
import { mapGetOrCreate, MapLike } from './map';
import { assertDefined, mustBeDefined } from './typeAssertions';

interface MapDeleteLike<K, V> extends MapLike<K, V> {
  size?: number;
  delete(key: K): boolean;
}

interface MemoNode<R> {
  memo?: R;
  children?: MapDeleteLike<unknown, MemoNode<R>>;
}

export function memoizeWithWeakMap<Args extends object[], R>(
  fn: (...args: Args) => R
): (...args: Args) => R {
  const root: MemoNode<R> = {};
  return (...args: Args): R => {
    let node = root;
    for (const arg of args) {
      node.children ??= new WeakMap();
      node = mapGetOrCreate(node.children, arg, () => ({})).value;
    }

    if ('memo' in node) {
      return node.memo as R;
    }

    node.memo = fn(...args);
    return node.memo;
  };
}

function memoIsEmpty<R>(node: MemoNode<R>) {
  if ('memo' in node) {
    return false;
  }

  if (node.children) {
    return node.children.size === 0;
  }

  return true;
}

export function memoizeWithLRU<Args extends unknown[], R>(
  limit: number,
  fn: (...args: Args) => R
): (...args: Args) => R {
  if (limit < 1) {
    return fn;
  }

  const root: MemoNode<{ result: R; args: Args }> = {};
  const lru: Args[] = [];
  const infinite = limit === Infinity;

  return (...args: Args) => {
    let node = root;
    for (const arg of args) {
      node.children ??= new Map();
      node = mapGetOrCreate(node.children, arg, () => ({})).value;
    }

    if (node.memo) {
      if (!infinite) {
        lru.splice(lru.indexOf(node.memo.args), 1);
        lru.push(node.memo.args);
      }
      return node.memo.result;
    }

    const result = fn(...args);
    node.memo = {
      args,
      result,
    };
    if (!infinite) {
      lru.push(args);
    }

    if (lru.length > limit) {
      const del = lru.shift();
      if (del) {
        let delNode = root;
        const parents: Array<typeof root> = [];
        for (const arg of del) {
          assertDefined(delNode.children);
          parents.push(delNode);
          delNode = mapMustGet(delNode.children, arg);
        }

        delete delNode.memo;

        for (let i = del.length - 1; i >= 0; i--) {
          const arg = del[i];
          const argParent = mustBeDefined(parents[i]);
          if (memoIsEmpty(delNode)) {
            assertDefined(argParent.children);
            argParent.children.delete(arg);
            delNode = argParent;
          } else {
            break;
          }
        }
      }
    }

    return result;
  };
}
