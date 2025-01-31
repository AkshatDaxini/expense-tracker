import {
  View,
  SafeAreaView,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import supabase from "../../services/supabase";
import { useRouter } from "expo-router";
import CustomModal from "../../components/CustomModel";
import SelectionList from "../../components/SelectionList";
import { categoryImageMap, priceFormatter } from "../../utils/helperFunctions";
import { useAuth } from "../../context/AuthContext";
import { insertExpense, updateExpense } from "../../services/api";

const AddExpenseScreen = ({ expense = null, onCloseModal }) => {
  const [selectedCategory, setSelectedCategory] = useState(
    expense?.category || "general"
  );
  const { userInfo } = useAuth();

  const [formData, setFormData] = useState({
    amount: expense ? priceFormatter(expense.amount).split("$")[1] : "",
    category: expense ? expense.category : "general",
    date: expense ? new Date(expense.date) : new Date(),
    description: expense ? expense.description : "",
    email_id: userInfo.email,
  });

  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const router = useRouter();

  const handleAddExpense = async () => {
    if (expense) {
      await updateExpense(expense.id, formData);
      Alert.alert("Expense Updated Successfully");
      onCloseModal();
    } else {
      await insertExpense(formData);
      Alert.alert(
        "Expense Added Successfully",
        "What would you like to do next?",
        [
          {
            text: "Add More",
            onPress: () => {
              setFormData({
                amount: "",
                category: "",
                date: new Date(),
                description: "",
              });
              expense = null;

              router.navigate("AddExpenseScreen");
            },
          },
          {
            text: "Done",
            onPress: () => {
              setFormData({
                amount: "",
                category: "",
                date: new Date(),
                description: "",
              });
              expense = null;

              onCloseModal();
            },
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    }
  };

  // Handle input changes
  const handleInputChange = (name, value) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCategorySelection = (category) => {
    setShowCategoryPicker(false);
    handleInputChange("category", category);
    setSelectedCategory(category);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.formContainer}>
            {/* Date Picker */}
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                testID="dateTimePicker"
                value={formData.date}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={(e, selectedDate) => {
                  if (selectedDate) {
                    // Normalize the selected date to UTC by creating a new Date object
                    const normalizedDate = new Date(selectedDate);
                    normalizedDate.setHours(0, 0, 0, 0); // Ensure the time is set to midnight
                    setFormData({ ...formData, date: normalizedDate });
                  }
                }}
              />
            </View>

            <View style={styles.column}>
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.ImageContainerStyle}
                  // onPress={() => setShowCategoryPicker(true)}
                >
                  <Image
                    style={styles.ImageStyle}
                    source={require("../../assets/Categories/dollar.png")}
                  />
                </TouchableOpacity>
                <TextInput
                  style={styles.InputStyle}
                  placeholder="Amount"
                  placeholderTextColor={"#000000"}
                  value={formData.amount} // Use value instead of defaultValue
                  onChangeText={(text) => handleInputChange("amount", text)} // Use onChangeText
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.ImageContainerStyle}
                  onPress={() => setShowCategoryPicker(true)}
                >
                  <Image
                    style={styles.ImageStyle}
                    source={categoryImageMap[selectedCategory]}
                  />
                </TouchableOpacity>
                <TextInput
                  style={styles.InputStyle}
                  placeholder="Description"
                  placeholderTextColor={"#000000"}
                  value={formData.description}
                  onChangeText={(text) =>
                    handleInputChange("description", text)
                  }
                />
              </View>
            </View>

            {/* Submit Button */}
            <Button
              style={styles.ButtonStyle}
              title={expense ? "Update Expense" : "Add Expense"}
              onPress={handleAddExpense}
            />
          </View>
          {showCategoryPicker && (
            <CustomModal
              showModal={showCategoryPicker}
              onCloseModal={() => setShowCategoryPicker(false)}
              headerTitle="Select Category"
            >
              <SelectionList
                handleCategorySelection={handleCategorySelection}
              />
            </CustomModal>
          )}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default AddExpenseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ImageContainerStyle: {
    height: 60,
    width: 60,
    padding: 10,
  },
  formContainer: {
    width: "95%",
    display: "flex",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    margin: 10,
    padding: 10,
  },
  datePickerContainer: {
    width: "100%",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    margin: 10,
    marginBottom: 0,
    padding: 10,
  },

  row: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignContent: "center",
    justifyContent: "center",
    margin: 10,
  },

  column: {
    display: "flex",
    flexDirection: "column",
    width: "80%",
    justifyContent: "center",
  },

  datePicker: {
    width: "100%",
    color: "black",
  },
  InputStyle: {
    borderRadius: 5,
    fontSize: 20,
    width: "100%",
    color: "black",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },

  ImageStyle: {
    width: "100%",
    height: "100%",
  },

  ButtonStyle: {
    borderRadius: 5,
    fontSize: 20,
    width: "100%",
    padding: 10,
    margin: 10,
  },
});
