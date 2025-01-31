import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { categoryImageMap } from "../utils/helperFunctions";
import { useState } from "react";

const SelectionList = ({ handleCategorySelection }) => {
  const categoryList = Object.keys(categoryImageMap);

  return (
    <SafeAreaView>
      <View>
        <View style={styles.container}>
          {categoryList.map((category) => (
            <TouchableOpacity
              onPress={() => {
                handleCategorySelection(category);
              }}
              key={category}
              style={styles.card}
            >
              <Image
                alt={category}
                style={styles.cardImage}
                source={categoryImageMap[category]}
              />
              <Text style={styles.cardText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SelectionList;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    width: "100%",
  },

  card: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
    width: "25%",
  },

  cardImage: {
    width: 40,
    height: 40,
    backgroundColor: "#f8f8f8",
  },

  cardText: {
    fontSize: 16,
    marginTop: 10,
    fontStyle: "italic",
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    textTransform: "capitalize",
  },
});
