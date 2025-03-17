import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import CardContainer from "../components/CardContainer"; // Adjust the path as necessary
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import axios from "axios";
import { useAuth } from "./AuthContext";
import DataScreen from "./datatypes/[id]"; // Adjust the path based on your project structure

export default function HomeAssistant() {
  const router = useRouter();
  const { walletInfo, logout } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<{
    mainText: string;
    subText: string;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [categories, setCategories] = useState<{
    [key: string]: {
      category: string;
      name: string;
      measurement: string;
      isActive: boolean;
    }[];
  }>({});
  const [newDataType, setNewDataType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [measurement, setMeasurement] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchDataTypes = async () => {
    try {
      setLoading(true);
      console.log("Fetching data for wallet:", walletInfo.address);

      const response = await axios.post(
        "http://129.74.152.201:5100/get-registered-devices",
        { wallet_id: walletInfo.address }
      );

      console.log("Full API Response:", response.data);

      const responseData = response.data.devices || [];

      if (!Array.isArray(responseData) || responseData.length === 0) {
        console.warn("No devices found, using default categories.");
        setCategories({
          Health: [
            { category: "Health", name: "Heart Rate", measurement: "bpm", isActive: true },
            { category: "Health", name: "Blood Pressure", measurement: "mmHg", isActive: true },
          ],
          Home: [{ category: "Home", name: "Temperature", measurement: "°C", isActive: true }],
        });
        return;
      }

      // Merge categories correctly
      const groupedData = responseData.reduce((acc, item) => {
        if (!item.category || !item.name) {
          console.warn("Skipping item with missing category or name:", item);
          return acc;
        }

        // Ensure Health category only appears once and includes HR + BP
        if (!acc[item.category]) acc[item.category] = [];

        // Avoid adding duplicate entries
        const exists = acc[item.category].some(
          (existing) => existing.name === item.name
        );
        if (!exists) {
          acc[item.category].push({
            category: item.category,
            name: item.name,
            measurement: item.measurement_unit || "N/A",
            isActive: true, // Default to false
          });
        }

        return acc;
      }, {});

      console.log("Grouped Data:", groupedData);
      setCategories(groupedData);
    } catch (error) {
      console.error("Error fetching data types:", error);
      setCategories({
        Health: [
          { category: "Health", name: "Heart Rate", measurement: "bpm", isActive: true },
          { category: "Health", name: "Blood Pressure", measurement: "mmHg", isActive: true },
        ],
        Home: [{ category: "Home", name: "Temperature", measurement: "°C", isActive: true }],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataTypes();
  }, []);

  const handleCardPress = (mainText: string, subText: string) => {
    setSelectedCard({ mainText, subText });
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 10, // Instant duration
      useNativeDriver: true,
    }).start();
  };


  const handleCloseModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 10, // Instant duration
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedCard(null);
    });
  };

  const handleEditPress = () => {
    setIsEditing(!isEditing);
    setCategories(prevCategories => {
      const newCategories = { ...prevCategories };
      Object.keys(newCategories).forEach(category => {
        if (!isEditing) {
          newCategories[category].push({
            category,
            name: "Create New Card",
            measurement: "Insert Data",
            isActive: false,
          });
        } else {
          newCategories[category] = newCategories[category].filter(
            item => item.name !== "Create New Card"
          );
        }
      });
      return newCategories;
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Welcome to Web3DB App, User!</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
            <MaterialCommunityIcons
              name={isEditing ? "check" : "pencil"}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.outerContainer}>
          {Object.entries(categories).map(([categoryName, items]) => (
            <CardContainer
              key={categoryName}
              title={categoryName}
              items={items} // Pass items array to CardContainer
              onCardPress={handleCardPress}
              isEditing={isEditing}
            />
          ))}
        </View>

        {selectedCard && (
          <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={handleCloseModal}
          >
            <Animated.View
              style={[styles.modalContainer, { opacity: fadeAnim }]}
            >
              <View style={styles.modalContent}>
                <TouchableOpacity
                  onPress={handleCloseModal}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
                <DataScreen
                  dataType={selectedCard.mainText}
                  measurement={selectedCard.subText}
                />
              </View>
            </Animated.View>
          </Modal>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 20,
  },
  categoryContainer: {
    width: "100%",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    textAlign: "center",
    flex: 1,
  },
  editButton: {
    backgroundColor: "#4da6ff",
    padding: 10,
    borderRadius: 100,
    marginRight: 40,
  },
  outerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 20,
    flexWrap: "wrap", // Allow containers to wrap to the next line
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "40%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalMainText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalSubText: {
    fontSize: 18,
    color: "gray",
  },
});
