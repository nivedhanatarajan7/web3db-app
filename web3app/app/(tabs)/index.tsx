import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  TextInput,
  Button,
} from "react-native";
import CardContainer from "../../components/CardContainer"; // Adjust the path as necessary
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import axios from "axios";
import { useAuth } from "../AuthContext";
import DataScreen from "../datatypes/[id]"; // Adjust the path based on your project structure

export default function HomeAssistant() {
  const router = useRouter();
  const { walletInfo, logout } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<{
    category: string;

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
  const [newContainerName, setNewContainerName] = useState("");
  const [addContainerModalVisible, setAddContainerModalVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

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

  const handleCardPress = (category:string, mainText: string, subText: string) => {
    setSelectedCard({ category, mainText, subText });
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

  const handleAddContainer = () => {
    if (newContainerName) {
      setCategories((prevCategories) => ({
        ...prevCategories,
        [newContainerName]: [
          {
            category: newContainerName,
            name: "Create New Card",
            measurement: "Insert Data",
            isActive: false,
          },
        ],
      }));
      setNewContainerName("");
      setAddContainerModalVisible(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Welcome to Web3DB App, User!</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.addButton,
                !isEditing && styles.hidden,
                isHovered && styles.addButtonHovered,
              ]}
              onPress={() => setAddContainerModalVisible(true)}
              disabled={!isEditing}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Text style={styles.addButtonText}>Add New Container</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
              <MaterialCommunityIcons
                name={isEditing ? "check" : "pencil"}
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
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
                  category={selectedCard.category}

                  dataType={selectedCard.mainText}
                  measurement={selectedCard.subText}
                />
              </View>
            </Animated.View>
          </Modal>
        )}

        <Modal
          transparent={true}
          visible={addContainerModalVisible}
          onRequestClose={() => setAddContainerModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Container</Text>
              <TextInput
                placeholder="Container Name"
                style={styles.input}
                value={newContainerName}
                onChangeText={setNewContainerName}
              />
              <View style={styles.buttonRow}>
                <Button
                  title="Cancel"
                  onPress={() => setAddContainerModalVisible(false)}
                  color="gray"
                />
                <Button
                  title="Add"
                  onPress={handleAddContainer}
                  color="#2196F3"
                />
              </View>
            </View>
          </View>
        </Modal>
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
    paddingTop: 30, // Add padding to the top
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Adjust this to space-between
    width: "100%",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    right: 0,
  },
  addButton: {
    backgroundColor: "#4da6ff",
    padding: 10,
    borderRadius: 100,
    marginRight: 10,
    transition: "transform 0.2s", // Add transition for smooth scaling
  },
  addButtonHovered: {
    transform: "scale(1.05)", // Scale up the button when hovered
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  hidden: {
    opacity: 0,
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
    alignContent: "flex-start",
    width: "100%",
    marginBottom: 0,
    /* paddingHorizontal: 50, */
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
    width: "100%",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
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