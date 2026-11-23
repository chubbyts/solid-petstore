import { createSignal } from 'solid-js';

export type ListKeys = {
  add: () => void;
  remove: (i: number) => void;
  // call on submit: remembers the order of the rows as sent to the server
  submit: () => void;
  // index of row i in the last submit (-1 if added since), to find its errors (e.g. `vaccinations[${index}][name]`)
  submittedIndex: (i: number) => number;
};

// the server reports errors by the index in the submitted list: removing a row would move them to the next row
export const useListKeys = (initialLength: number): ListKeys => {
  // oxlint-disable-next-line functional/no-let
  let nextKey = initialLength;
  const [getKeys, setKeys] = createSignal<Array<number>>(Array.from({ length: initialLength }, (_, i) => i));
  const [getSubmittedKeys, setSubmittedKeys] = createSignal<Array<number>>(getKeys());

  return {
    add: () => {
      const key = nextKey++;
      setKeys((current) => [...current, key]);
    },
    remove: (i) => setKeys((current) => current.filter((_, y) => y !== i)),
    submit: () => setSubmittedKeys(getKeys()),
    submittedIndex: (i) => getSubmittedKeys().indexOf(getKeys()[i]),
  };
};
