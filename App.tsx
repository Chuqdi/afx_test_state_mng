import {Text} from 'react-native';

import React, {Suspense} from 'react';
import {QueryClient, QueryClientProvider} from 'react-query';
import {Provider as JotaiProvider} from 'jotai';
import Recommended from './src/Recommended';

function App(): React.JSX.Element {
  const queryClient = new QueryClient();

  return (
    <Suspense fallback={<Text>Loaduin</Text>}>
      <JotaiProvider>
        <QueryClientProvider client={queryClient}>
          <Recommended />
          {/* <Docs /> */}
        </QueryClientProvider>
      </JotaiProvider>
    </Suspense>
  );
}

export default App;
