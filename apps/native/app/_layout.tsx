import "../global.css";
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function HomeLayout() {
  return (
    <>
<Text>
  hello always here as layout</Text>
  <View className="flex-1 items-center justify-center bg-white text-red-500">
      <Text className='text-blue-400'>Open up App.js to start working on your app!</Text>
      <Text className='text-blue-400 text-xl'>Open up App.js to start working on your app!</Text>
      <Text>Open up App.js to start working on your app!</Text>
      <Text>Open up App.js to start working on your app!</Text>
      <Text>wowowowo up App.js to start working on your app!123</Text>
      <StatusBar style="auto" />
    </View>
        <Slot />
    </>
  );
}


