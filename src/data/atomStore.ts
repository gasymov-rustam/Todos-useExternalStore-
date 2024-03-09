import { SetStateAction, useSyncExternalStore } from 'react';

interface Atom<T> {
  get: () => T;
  set: (value: T) => void;
  subscribe: (callback: (value: T) => void) => () => void;
}

const isActionAtom = <T>(action: SetStateAction<T>): action is (last: T) => T => {
  return typeof action === 'function';
};

export const createAtom = <T>(initialValue: T): Atom<T> => {
  let value = initialValue;

  const subscribers = new Set<(value: T) => void>();

  return {
    get: () => value,
    set: (newValue) => {
      value = newValue;
      subscribers.forEach((callback) => callback(value));
    },
    subscribe: (callback) => {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    },
  };
};

export const useAtom = <T>(atom: Atom<T>) => {
  const value = useSyncExternalStore(atom.subscribe, atom.get);

  const setValue = (action: SetStateAction<T>) => {
    if (isActionAtom(action)) {
      atom.set(action(atom.get()));
    } else {
      atom.set(action);
    }
  };

  return { value, setValue };
};
