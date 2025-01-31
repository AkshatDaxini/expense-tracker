import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getExpensesBasedOnEmail } from "../../services/api";
import {
  getMonthName,
  getTotalExpenses,
  getTotalForAllCategories,
  groupExpensesByMonthAndYear,
  priceFormatter,
} from "../../utils/helperFunctions";
import CustomModal from "../../components/CustomModel";
import Table from "../../components/Table";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";

const AnalyticsScreen = () => {
  const { userInfo } = useAuth();
  const [selectedExpense, setSelectedExpense] = useState(null); // State to track the selected month
  const [showMonthModal, setShowMonthModal] = useState(false);

  const getExpensesBasedOnEmailQuery = useQuery({
    queryKey: ["expenses"],
    queryFn: () => getExpensesBasedOnEmail(userInfo?.email),
    enabled: !!userInfo,
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error("Error fetching expenses:", error);
    },
  });

  if (getExpensesBasedOnEmailQuery.isLoading) {
    return <Loader />;
  }

  if (getExpensesBasedOnEmailQuery.isError) {
    return <Text>Error: {getExpensesBasedOnEmailQuery.error.message}</Text>;
  }

  if (
    getExpensesBasedOnEmailQuery.data === undefined ||
    getExpensesBasedOnEmailQuery.data.length === 0
  ) {
    return <Text>No expenses found</Text>;
  }

  const expensesByMonthAndYear = groupExpensesByMonthAndYear(
    getExpensesBasedOnEmailQuery.data
  );

  const sortedExpenses = Object.entries(expensesByMonthAndYear).sort(
    (a, b) => b[0] - a[0]
  ); // Sort by year (numeric order)

  // If you want the result back as an object:
  const sortedExpensesObject = Object.fromEntries(sortedExpenses);
  const headers = ["Category", "Amount"];

  let rows = [];

  if (selectedExpense && selectedExpense.totalForAllCategories) {
    rows = Object.keys(selectedExpense.totalForAllCategories).map(
      (category) => ({
        category,
        amount: priceFormatter(selectedExpense.totalForAllCategories[category]),
      })
    );
  }

  return (
    <SafeAreaView>
      <View>
        {Object.keys(expensesByMonthAndYear).map((year) => {
          return (
            <View
              key={year}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 10,
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>{year}</Text>
              {Object.keys(expensesByMonthAndYear[year]).map((month) => {
                return (
                  <View
                    key={month}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        width: "100%",
                        borderWidth: 1,
                        borderColor: "lightgrey",
                        padding: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => {
                        setShowMonthModal(true);
                        setSelectedExpense({
                          year: year,
                          month: month,
                          totalExpenses: getTotalExpenses(
                            expensesByMonthAndYear[year][month]
                          ),
                          totalForAllCategories: getTotalForAllCategories(
                            expensesByMonthAndYear[year][month]
                          ),
                          expenses: expensesByMonthAndYear[year][month],
                        });
                      }}
                    >
                      <Text style={{ fontSize: 18, marginVertical: 5 }}>
                        {getMonthName(month)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
      <CustomModal
        showModal={showMonthModal}
        onCloseModal={() => setShowMonthModal(false)}
        headerTitle={
          selectedExpense
            ? `${getMonthName(selectedExpense.month)}-${selectedExpense.year}`
            : "No data selected"
        }
      >
        {selectedExpense && (
          <>
            <View style={{ alignItems: "center", marginVertical: 20 }}>
              <Text style={styles.totalText}>Total Expenses</Text>
              <Text style={styles.totalText}>
                {priceFormatter(selectedExpense.totalExpenses)}
              </Text>
            </View>

            <Table headers={headers} rows={rows} />
          </>
        )}
      </CustomModal>
    </SafeAreaView>
  );
};

export default AnalyticsScreen;

const styles = StyleSheet.create({
  totalText: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
