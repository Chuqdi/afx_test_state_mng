import {useAtom} from 'jotai';
import {useQuery} from 'react-query';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createJSONStorage, atomWithStorage} from 'jotai/utils';
import axios from 'axios';
import {useEffect} from 'react';

const asyncStore = createJSONStorage(() => AsyncStorage);
const storedDataAtom = atomWithStorage('USERS_LIST', [], asyncStore, {
  getOnInit: true,
});

const Recommended = () => {
  const [storedData, setStoredData] = useAtom(storedDataAtom);
  const {data, isLoading} = useQuery(
    'USERS',
    async () => await axios.get('https://jsonplaceholder.typicode.com/users'),
  );

  const handleUpdate = (name: string) => {
    const newData = storedData?.map(d => {
      if (d.name === name) {
        return {...d, name: `${d.name} updated`};
      }
      return d;
    });
    setStoredData(newData);
  };

  const deleteNow = (name: string) =>
    setStoredData(storedData?.filter(d => d.name !== name));

  useEffect(() => {
    if (data?.data && !!data?.data?.length) {
      setStoredData(data?.data);
    }
  }, [data]);

  return (
    <SafeAreaView
      style={{
        marginTop: 30,
        marginHorizontal: 30,
      }}>
      {!!storedData.length && (
        <FlatList
          contentContainerStyle={{gap: 10}}
          data={storedData}
          renderItem={({item, index}) => (
            <TouchableOpacity onPress={() => handleUpdate(item?.name)}>
              <Text>{item?.name}</Text>
              <Pressable onPress={() => deleteNow(item?.name)}>
                <Text>Delete Now</Text>
              </Pressable>
            </TouchableOpacity>
          )}
        />
      )}

      {isLoading && (
        <View>
          <Text>Loading or no data available...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Recommended;
