import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // Make sure Ionicons is installed

// Custom Modal Component
const CustomModal = ({ showModal, onCloseModal, children, headerTitle }) => {
  return (
    <Modal
      animationType="slide"
      transparent={false} // Fullscreen modal
      visible={showModal}
      onRequestClose={() => {
        onCloseModal();
      }} // Close modal on Android back press
    >
      <View style={styles.modalBackground}>
        <SafeAreaView style={styles.modalContent}>
          {/* Header with Back Button */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => onCloseModal()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{headerTitle}</Text>
          </View>
          {children}
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    marginLeft: 8,
    fontSize: 18,
    color: "black",
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
  },
});
