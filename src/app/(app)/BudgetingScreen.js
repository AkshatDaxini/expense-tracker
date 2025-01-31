import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  ScrollView,
  Button,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { categoryImageMap, priceFormatter } from "../../utils/helperFunctions";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";

const BudgetingScreen = () => {
  const categoryList = Object.keys(categoryImageMap);
  const [editedCategory, setEditedCategory] = useState(null);
  const [amount, setAmount] = useState(0);
  const [categoryWithAmount, setCategoryWithAmount] = useState({});

  return (
    <SafeAreaView style={{ flex: 1, marginBottom: 80 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            width: "100%",
            height: "10%",
            backgroundColor: "#f8f8f8",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 20, margin: 10 }}>
            Total Monthly Budget:{" "}
            {priceFormatter(
              Object.values(categoryWithAmount).reduce(
                (total, amount) => parseFloat(total) + parseFloat(amount),
                0
              )
            )}
          </Text>
        </View>
        <ScrollView style={styles.container}>
          {categoryList.map((category) => (
            <View key={category} style={styles.row}>
              <View
                style={{
                  ...styles.card,
                  flex: 1,
                }}
              >
                <Image
                  alt={category}
                  style={styles.cardImage}
                  source={categoryImageMap[category]}
                />
                <Text style={styles.cardText}>{category}</Text>
              </View>
              {editedCategory === category ? (
                <View
                  style={{
                    ...styles.card,
                    flex: 1,
                  }}
                >
                  <TextInput
                    style={{
                      ...styles.cardText,
                    }}
                    placeholder="Amount"
                    placeholderTextColor={"#000000"}
                    value={amount}
                    onChangeText={(text) => setAmount(text)}
                    keyboardType="decimal-pad"
                    editable={true}
                  />
                </View>
              ) : (
                <View
                  style={{
                    ...styles.card,
                    flex: 1,
                  }}
                >
                  <Text style={styles.cardText}>
                    {priceFormatter(categoryWithAmount[category] || 0)}
                  </Text>
                </View>
              )}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                {editedCategory === category ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 1,
                      justifyContent: "center",
                      gap: 20,
                      height: "100%",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setEditedCategory(null);
                        setCategoryWithAmount({
                          ...categoryWithAmount,
                          [category]: amount,
                        });
                        setAmount(0);
                      }}
                    >
                      <AntDesign name="check" size={24} color="green" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setEditedCategory(null);
                      }}
                    >
                      <Entypo name="cross" size={24} color="red" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Button
                    title="Set Budget"
                    onPress={() => {
                      setEditedCategory(category);
                      setAmount(categoryWithAmount[category] || 0);
                    }}
                  />
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default BudgetingScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    overflow: "scroll",
  },

  row: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },

  card: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "33%",
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
