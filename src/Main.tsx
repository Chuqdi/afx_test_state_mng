import {View, Text, SafeAreaView, FlatList} from 'react-native';
import React, { useState } from 'react';
import {todosAtom} from './atom';
import {useAtom} from 'jotai/react';

const Main = () => {
  const [response, setResponse] = useState();
  const [{data, isPending, isError, isLoading}] = useAtom(todosAtom);
  data?.json().then(d => {
    setResponse(d);
  });
  return (
    <SafeAreaView>
      <FlatList
        data={response}
        renderItem={({item, index}) => (
          <View>
            <Text>{item?.address?.city}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Main;
