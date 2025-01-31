import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const Loader = ({ msg }) => {
  return (
    <View>
      <ActivityIndicator size="large" color="black" />
      {msg && <Text>{msg}</Text>}
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({});
