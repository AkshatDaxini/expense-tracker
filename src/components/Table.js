import React from "react";
import { View, Text } from "react-native";

// Table Component
const Table = ({ headers, rows }) => {
  if (headers.length === 0 || rows.length === 0) {
    return null;
  }

  return (
    <View style={styles.tableContainer}>
      {/* Table Header */}
      <View style={styles.tableHeader}>
        {headers.map((header, index) => (
          <Text key={index} style={styles.headerText}>
            {header}
          </Text>
        ))}
      </View>

      {/* Table Rows */}
      {rows.map((row, index) => (
        <View key={index} style={styles.tableRow}>
          {Object.values(row).map((value, i) => (
            <Text key={i} style={styles.cell}>
              {value}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = {
  tableContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  headerText: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: "center",
    color: "#333",
  },
};

export default Table;
