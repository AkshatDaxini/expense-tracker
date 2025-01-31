import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteExpense, getExpensesBasedOnEmail } from "../../services/api";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  getCategoryIcon,
  getMonthName,
  getTotalExpenses,
  groupExpensesByMonthAndYear,
  priceFormatter,
} from "../../utils/helperFunctions";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { useRouter } from "expo-router";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";
import CustomModal from "../../components/CustomModel";
import AddExpenseScreen from "./AddExpenseScreen";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const HomeScreen = () => {
  const { session, userInfo } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const router = useRouter();
  const currentMonth = getMonthName(new Date().getMonth());
  const [showModalForAddExpense, setShowModalForAddExpense] = useState(false);
  const [isSortMenuVisible, setIsSortMenuVisible] = useState(false);
  const [isFilterMenuVisible, setIsFilterMenuVisible] = useState(false);

  const handleSortButtonClick = () => {
    setIsSortMenuVisible(!isSortMenuVisible);
    setIsFilterMenuVisible(false); // Close filter menu if it's open
  };

  const handleFilterButtonClick = () => {
    setIsFilterMenuVisible(!isFilterMenuVisible);
    setIsSortMenuVisible(false); // Close sort menu if it's open
  };
  const sortOptions = [
    { label: "Amount", value: "amount" },
    { label: "A to Z", value: "AtoZ" },
    { label: "Z to A", value: "ZtoA" },
    { label: "Date", value: "date" },
  ];

  const filterOptions = [{ label: "Filter by Category", value: "category" }];

  // Fetch expenses based on the user's email
  const getExpensesBasedOnEmailQuery = useQuery({
    queryKey: ["expenses"],
    queryFn: () => getExpensesBasedOnEmail(userInfo?.email),
    enabled: !!userInfo,
    refetchOnWindowFocus: false,

    onError: (error) => {
      console.error("Error fetching expenses:", error);
    },
  });

  // Mutation to delete the selected expense
  const deleteExpenseRecordMutation = useMutation({
    mutationKey: "deleteExpense",
    mutationFn: () => deleteExpense(selectedExpense?.id, userInfo?.email),
    onSuccess: () => {
      getExpensesBasedOnEmailQuery.refetch();
      setShowConfirmation(false);
      Alert.alert("Expense deleted successfully");
    },
  });

  // Refresh the expense list
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getExpensesBasedOnEmailQuery
      .refetch()
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  }, [getExpensesBasedOnEmailQuery]);

  // Handle the delete action
  const handleDelete = () => {
    deleteExpenseRecordMutation.mutate();
  };

  const handleSortOptionClick = (value) => {
    const sortedData = expenses.sort((a, b) => {
      if (value === "amount") {
        return b.amount - a.amount; // Sort by amount in descending order
      } else if (value === "AtoZ") {
        return a.description.localeCompare(b.description); // Sort alphabetically in ascending order
      } else if (value === "ZtoA") {
        return b.description.localeCompare(a.description); // Sort alphabetically in descending order
      } else if (value === "date") {
        return new Date(b.date) - new Date(a.date); // Sort by date in descending order
      }
      return 0;
    });

    setIsSortMenuVisible(false);
    setExpenses(sortedData);
  };

  // Render swipeable actions for each item
  const renderRightActions = (item) => {
    return (
      <View style={styles.actionContainerRight}>
        <TouchableOpacity
          style={{ ...styles.btnContainer, backgroundColor: "red" }}
          onPress={() => {
            setSelectedExpense(item);
            setShowConfirmation(true);
          }}
        >
          <AntDesign name="delete" size={16} color="white" />
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.btnContainer, backgroundColor: "blue" }}
          onPress={() => {
            setSelectedExpense(item);
            setShowModalForAddExpense(true);
          }}
        >
          <MaterialIcons name="mode-edit" size={16} color="white" />
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    if (getExpensesBasedOnEmailQuery.data) {
      const groupedExpenses = groupExpensesByMonthAndYear(
        getExpensesBasedOnEmailQuery.data
      );
      const sortedData = groupedExpenses[currentYear]?.[currentMonth]?.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setExpenses(sortedData || []);
    }
  }, [getExpensesBasedOnEmailQuery.data]);

  // Render each expense item
  const renderItem = ({ item }) => (
    <ReanimatedSwipeable
      renderRightActions={() => renderRightActions(item)}
      overshootLeft={false}
      overshootRight={false}
      friction={2}
    >
      <View style={styles.expenseItem}>
        <View style={styles.dateContainer}>
          <Text>{getMonthName(new Date(item.date).getMonth(), true)}</Text>
          <Text>{new Date(item.date).getDate()}</Text>
        </View>

        <View style={styles.categoryIcon}>
          {getCategoryIcon(item.category)}
        </View>
        <View style={styles.expenseText}>
          <Text>{item.description}</Text>
        </View>
        <Text style={styles.amountStyle}>{priceFormatter(item.amount)}</Text>
      </View>
    </ReanimatedSwipeable>
  );

  if (!userInfo) {
    return <Loader msg="Loading user info" />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {getExpensesBasedOnEmailQuery.isLoading ? (
          <Loader />
        ) : getExpensesBasedOnEmailQuery.isError ? (
          <Text>Error fetching expenses</Text>
        ) : !getExpensesBasedOnEmailQuery.data ||
          getExpensesBasedOnEmailQuery.data.length === 0 ? (
          <Text>No expenses found</Text>
        ) : (
          <GestureHandlerRootView
            style={{
              flex: 1,
              marginBottom: 12,
              paddingBottom: 12,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                width: "100%",
                height: "10%",
                backgroundColor: "#f8f8f8",
                alignItems: "center",
              }}
            >
              <Text style={{ textAlign: "center", fontSize: 20, margin: 10 }}>
                Total Expenses: {priceFormatter(getTotalExpenses(expenses))}
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                height: "10%",
                backgroundColor: "#f8f8f8",
                alignItems: "center",
                marginTop: 10,
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  marginLeft: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  {currentMonth} {new Date().getFullYear()}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  backgroundColor: "#f8f8f8",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity
                  style={{ marginRight: 10 }}
                  onPress={handleSortButtonClick}
                >
                  <FontAwesome5
                    name="sort-amount-down"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginRight: 10 }}
                  onPress={handleFilterButtonClick}
                >
                  <AntDesign name="filter" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginRight: 10 }}>
                  <AntDesign name="adduser" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>

            <FlatList
              refreshing={refreshing}
              onRefresh={onRefresh}
              contentContainerStyle={{ paddingBottom: 10, marginBottom: 10 }}
              data={expenses}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
            />
          </GestureHandlerRootView>
        )}
      </View>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowModalForAddExpense(true)}
      >
        <AntDesign name="plus" size={32} color="white" />
      </TouchableOpacity>

      {showConfirmation && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ConfirmationDialog
            visible={showConfirmation}
            message="Are you sure you want to delete this item?"
            onConfirm={handleDelete}
            onCancel={() => {
              setShowConfirmation(false);
              setSelectedExpense(null);
            }}
            onClose={() => {
              setShowConfirmation(false);
              setSelectedExpense(null);
            }}
          />
        </View>
      )}
      {showModalForAddExpense && (
        <CustomModal
          showModal={showModalForAddExpense}
          onCloseModal={() => {
            setShowModalForAddExpense(false);
            setSelectedExpense(null);
          }}
          headerTitle={selectedExpense ? "Update Expense" : "Add Expense"}
        >
          <AddExpenseScreen
            expense={selectedExpense}
            onCloseModal={() => {
              getExpensesBasedOnEmailQuery.refetch();
              setShowModalForAddExpense(false);
              setSelectedExpense(null);
            }}
          />
        </CustomModal>
      )}
      {/* Sort Dropdown */}
      {isSortMenuVisible && (
        <View
          style={{
            position: "absolute",
            top: 220,
            right: 100,
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 5,
            width: 200,
            zIndex: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            // backgroundColor: "red",
          }}
        >
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={{ padding: 10 }}
              onPress={() => handleSortOptionClick(option.value)}
            >
              <Text>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Filter Dropdown */}
      {isFilterMenuVisible && (
        <View
          style={{
            position: "absolute",
            top: 220,
            right: 50,
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 5,
            width: 200,
            zIndex: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
          }}
        >
          {filterOptions.map((option) => (
            <TouchableOpacity key={option.value} style={{ padding: 10 }}>
              <Text>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  expenseItem: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 5,
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  expenseText: {
    fontSize: 16,
    marginBottom: 5,
    flex: 1,
    justifyContent: "center",
  },
  categoryIcon: {
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#f8f8f8",
    width: "15%",
    marginRight: 10,
    display: "flex",
    justifyContent: "center",
    flexWrap: "nowrap",
    textWrap: "nowrap",
  },
  amountStyle: {
    fontSize: 16,
    marginBottom: 5,
  },
  dateContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  actionContainerRight: {
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    height: "100%",
    padding: 10,
  },
  btnContainer: {
    margin: 1,
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    padding: 10,
    gap: 5,
  },
  btnText: {
    fontSize: 16,
    color: "white",
  },

  // Floating Action Button styles
  fab: {
    position: "absolute",
    top: "90%",
    right: "5%",
    backgroundColor: "black",
    width: 70,
    height: 70,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // for Android shadow effect
  },
});
