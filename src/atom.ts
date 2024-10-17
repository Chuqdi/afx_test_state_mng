import { atomWithQuery } from "jotai-tanstack-query";

export const todosAtom = atomWithQuery((get) => {
  return {
    queryKey: ["todos"],
    queryFn: () => fetch("https://jsonplaceholder.typicode.com/users"),
  };
});


