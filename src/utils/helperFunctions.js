// utils/formatters.js

import { Image } from "react-native";

/**
 * Formats a number into a currency string with the specified locale and currency.
 * @param {number|string} amount - The price or amount to format.
 * @param {string} currency - The ISO currency code (e.g., "USD", "EUR").
 * @param {string} locale - The locale string (e.g., "en-US", "de-DE").
 * @returns {string} - The formatted price string.
 */
export const priceFormatter = (amount, currency = "USD", locale = "en-US") => {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
};

/**
 * Returns the name of the month based on the month number.
 * @param {number} month - The month number (1-12).
 * @returns {string} - The name of the month.
 */

export const getMonthName = (month, shortHand = false) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (shortHand) {
    return monthNames[month]?.slice(0, 3);
  }
  return monthNames[month];
};

export const categoryImageMap = {
  entertainment: require("../assets/Categories/entertainment.png"),
  travel: require("../assets/Categories/travel.png"),
  grocery: require("../assets/Categories/grocery.png"),
  food: require("../assets/Categories/restaurant.png"),
  gift: require("../assets/Categories/gift.png"),
  utilities: require("../assets/Categories/utilities.png"),
  gas: require("../assets/Categories/gas.png"),
  gaming: require("../assets/Categories/gaming.png"),
  loan: require("../assets/Categories/loan.png"),
  rent: require("../assets/Categories/rent.png"),
  insurance: require("../assets/Categories/insurance.png"),
  general: require("../assets/Categories/general.png"),
};

export const generateIconComponent = (category) => {
  const icon = categoryImageMap[category.toLowerCase()];
  if (icon) {
    return (
      <Image alt={category} style={{ width: 30, height: 30 }} source={icon} />
    );
  } else {
    return (
      <Image
        alt={category}
        style={{ width: 30, height: 30 }}
        source={require("../assets/Categories/general.png")}
      />
    );
  }
};
/**
 * Returns the category icon based on the category name.
 * @param {string} category - The category name.
 * @returns {string} - The category icon.
 */

export const getCategoryIcon = (category) => {
  category = category.toLowerCase();
  return generateIconComponent(category);
};

export const groupExpensesByMonthAndYear = (expense) => {
  const expensesByMonthAndYear = expense.reduce((acc, expense) => {
    const month = new Date(expense.date).getMonth();
    const year = new Date(expense.date).getFullYear();

    if (!acc[year]) {
      acc[year] = {};
    }

    if (!acc[year][month]) {
      acc[year][month] = [];
    }

    acc[year][month].push(expense);

    return acc;
  }, {});

  return expensesByMonthAndYear;
};

export const getTotalForAllCategories = (expenses) => {
  return expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {});
};

export const getTotalExpenses = (expenses) => {
  return expenses.reduce((acc, expense) => {
    return acc + expense.amount;
  }, 0);
};
