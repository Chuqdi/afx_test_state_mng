import {atomWithQuery} from 'jotai-tanstack-query';
import {atom} from 'jotai';
import {useAtom} from 'jotai';
import {useMutation} from 'react-query';
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createJSONStorage, atomWithStorage} from 'jotai/utils';

const asyncStore = createJSONStorage(() => AsyncStorage);

const fetchSomeData = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const updateSomeData = async (newData: any) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos/1', {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(newData),
  });
  if (!response.ok) {
    throw new Error('Failed to update data');
  }
  return response.json();
};

const storedDataAtom = atomWithStorage('queryData', null, asyncStore);

const queryDataAtom = atomWithQuery(get => {
  return {
    queryKey: ['todos'],
    queryFn: fetchSomeData,
  };
});

const syncedDataAtom = atom(
  get => {
    const queryData = get(queryDataAtom);
    const storedData = get(storedDataAtom);
    if (queryData.isError || !queryData.data) {
      return storedData;
    }

    return queryData.data;
  },
  (get, set, newData) => {
    set(storedDataAtom, newData);
  },
);

const Docs = () => {
  const [data, setData] = useAtom(syncedDataAtom);

  const mutation = useMutation(updateSomeData, {
    onSuccess: updatedData => {
      console.log(updatedData);
      // setData(updatedData);
    },
    onError: error => {
      console.error('Failed to update data:', error);
    },
  });

  const handleUpdate = (name: string) => {
    const newData = data?.map(d => {
      if (d.name === name) {
        return {...d, name: `${d.name} updated`};
      }
      return d;
    });
    // mutation.mutate(newData);
    setData(newData);
  };
  return (
    <SafeAreaView
      style={{
        marginTop: 30,
        marginHorizontal: 30,
      }}>
      {data && (
        <FlatList
          contentContainerStyle={{gap: 10}}
          data={data}
          renderItem={({item, index}) => (
            <TouchableOpacity onPress={() => handleUpdate(item?.name)}>
              <Text>{item?.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default Docs;
