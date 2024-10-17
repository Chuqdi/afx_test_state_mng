import React from "react";
import { Provider } from "jotai/react";
import { useHydrateAtoms } from "jotai/react/utils";

import { queryClientAtom } from "jotai-tanstack-query";
import Main from "./src/Main";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const HydrateAtoms = ({ children }) => {
  useHydrateAtoms([[queryClientAtom, queryClient]]);
  return children;
};

const MainApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <HydrateAtoms>
          <Main />
        </HydrateAtoms>
      </Provider>
    </QueryClientProvider>
  );
};

export default MainApp;
