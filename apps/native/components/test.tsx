import { Text } from "react-native";

export default function TestComponent({ name }: { name: string }) {
  return (
      <Text className="text-red-400">Hello, {name}</Text>
  );
}
