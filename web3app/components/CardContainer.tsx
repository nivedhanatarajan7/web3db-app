import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from "react-native";
import MaterialCard from "./MaterialCard"; // Adjust the path as necessary
import { useAuth } from "../app/AuthContext";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

type Card = {
  name: string;
  measurement_unit: string;
  isActive: boolean;
};

type CardContainerProps = {
  title: string;
  items: {
    isActive: boolean | undefined;
    category: string;
    name: string;
    measurement: string;
  }[];
  onCardPress: (mainText: string, subText: string) => void;
  isEditing: boolean;
};

const CardContainer: React.FC<CardContainerProps> = ({
  title,
  items,
  onCardPress,
  isEditing,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newMainText, setNewMainText] = useState('');
  const [newSubText, setNewSubText] = useState('');
  const [itemsList, setItemsList]= useState(items);
    const router = useRouter();
    const { walletInfo, logout } = useAuth();
  
    const [selectedCard, setSelectedCard] = useState<{ mainText: string; subText: string } | null>(null);
  
    const [categories, setCategories] = useState<{
      [key: string]: { value: string; measurement: string, isActive: boolean }[];
    }>({});
    const [newDataType, setNewDataType] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [customCategory, setCustomCategory] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [measurement, setMeasurement] = useState("");
    const [loading, setLoading] = useState(false);
    const [cards, setCards] = useState<Card[]>([]);

  const addDataType = async () => {
    const categoryToUse = customCategory ? newCategory : selectedCategory;
    const newEntry = {
      wallet_id: walletInfo.address,
      device_id: `${walletInfo.address}/${categoryToUse}/${newDataType}`,
      name: newDataType,
      category: categoryToUse,
      measurement_unit: measurement,
    };
    console.log(`${walletInfo.address}/data_type`);

    try {
      const response = await fetch("http://129.74.152.201:5100/add-device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });

      const responseData = await response.json(); // Read response

      window.location.reload();

    } catch {
      console.log("Error adding data");
    }
  };

  useEffect(() => {
    fetchDataTypes();
  }, []);

  const fetchDataTypes = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://129.74.152.201:5100/get-registered-devices",
        { wallet_id: walletInfo.address }
      );
  
      const responseData = response.data?.devices; // Fix: Accessing 'devices' directly
      console.log("Fetched Devices:", responseData); // Debugging
  
      if (!Array.isArray(responseData) || responseData.length === 0) {
        console.log("No devices received.");
        return;
      }
  
      const groupedData: { [key: string]: { value: string; measurement: string; isActive: boolean }[] } = {};
  
      responseData.forEach((item) => {
        if (!groupedData[item.category]) groupedData[item.category] = [];
        groupedData[item.category].push({
          value: item.name,
          measurement: item.measurement_unit,
          isActive: true,
        });
      });
  
      console.log("Grouped Data:", groupedData); // Debugging
      setCategories(groupedData);
    } catch (error) {
      console.error("Error fetching data types:", error);
    } finally {
      setLoading(false);
    }
  };
  
  

  // Add empty cards to ensure there are always 6 cards
  while (cards.length < 6) {
    cards.push({
      name: "Create New Card",
      measurement_unit: "Insert Data",
      isActive: false,
    });
  }

  const onEditCardPress = (index: number) => {
    const updatedItems = itemsList.filter((_, i) => i !== index);
    setItemsList(updatedItems);
  };

  const onEditAddCardPress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setNewMainText("");
    setNewSubText("");
  };

  const handleAddCard = async () => {
    await addDataType();
    const categoryToUse = customCategory ? newCategory : selectedCategory;
    const newItems = itemsList.filter((item) => item.isActive);

    newItems.push({
      isActive: true,
      category: categoryToUse,
      name: newDataType,
      measurement: measurement,
    });
    newItems.push({
      isActive: false,
      category: categoryToUse,
      name: "Create New Card",
      measurement: "Insert Data",
    });
    setItemsList(newItems);
    handleCloseModal();
  };

  return (
    <View style={styles.innerContainer}>
      <View style={styles.titleContainer}>
        <Text
          style={styles.innerContainerTitle}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      </View>
      <View style={styles.cardsContainer}>
        {itemsList.map((item, index) => (
          <View style={styles.cardWrapper} key={index}>
            <MaterialCard
              mainText={item.name}
              subText={item.measurement}
              onPress={
                isEditing
                  ? item.isActive
                    ? () => onEditCardPress(index)
                    : onEditAddCardPress
                  : () => onCardPress(item.name, item.measurement)
              }
              isEditing={isEditing}
              isActive={item.isActive}
            />
          </View>
        ))}
      </View>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add New Card</Text>

            <Text style={styles.formlabel}>Data Type</Text>
            <TextInput
              placeholder="Data Type Name"
              style={styles.input}
              value={newDataType}
              onChangeText={setNewDataType}
            />

            <Text style={styles.formlabel}>Category</Text>
            <Picker
  style={styles.pickerContainer}
  selectedValue={selectedCategory}
  onValueChange={(itemValue) => {
    if (itemValue === "Other") {
      setCustomCategory(true);
      setSelectedCategory("");
    } else {
      setCustomCategory(false);
      setSelectedCategory(itemValue);
    }
  }}
>
  <Picker.Item label="Select a Category" value="" />
  {Object.keys(categories).length > 0 ? (
    Object.keys(categories).map((category, index) => (
      <Picker.Item key={index} label={category} value={category} />
    ))
  ) : (
    <Picker.Item label="Loading categories..." value="" enabled={false} />
  )}
  <Picker.Item label="Create New Category" value="Other" />
</Picker>


            {customCategory && (
              <TextInput
                style={styles.input}
                placeholder="Enter new category"
                value={newCategory}
                onChangeText={setNewCategory}
              />
            )}

            <Text style={styles.formlabel}>Measurement Units</Text>
            <TextInput
              placeholder="Measurement Unit (e.g., bpm)"
              style={styles.input}
              value={measurement}
              onChangeText={setMeasurement}
            />

            <View style={styles.buttonRow}>
              <Button
                title="Cancel"
                onPress={() => setModalVisible(false)}
                color="gray"
              />
              <Button
                title={loading ? "Adding..." : "Add"}
                onPress={handleAddCard}
                color="#2196F3"
                disabled={loading}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    flexBasis: "30%", // Ensure three items per row
    flexDirection: "column",
    marginHorizontal: 20,
    paddingBottom: 20,
    height: "auto",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 15,
    marginBottom: 8,
  },
  innerContainerTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardWrapper: {
    width: "48%", // Adjust the width to fit two cards per row with some spacing
    marginBottom: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },

  modalContent: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  formlabel: {
    fontSize: 14,
    marginVertical: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
  },
  picker: {
    fontSize: 16,
    color: "#333",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
});

export default CardContainer;
