import { useRouter } from "expo-router";
import {
  ScrollView,
  View,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  Modal,
} from "react-native";
import {
  Card,
  Surface,
  Text,
  Title,
  Subheading,
  FAB,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "../AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { walletInfo, logout } = useAuth();

  const [categories, setCategories] = useState<{
    [key: string]: { value: string; measurement: string }[];
  }>({});
  const [newDataType, setNewDataType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [measurement, setMeasurement] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchDataTypes = async () => {
    ("");
    try {
      setLoading(true);
      const response = await axios.post(
        "http://75.131.29.55:5100/get-registered-devices",
        {
          wallet_id: walletInfo.address,
        }
      );

      const responseData = response.data?.data;

      if (!Array.isArray(responseData) || responseData.length === 0) {
        setCategories({
          Health: [{ value: "Heart Rate", measurement: "bpm" }],
          Home: [{ value: "Temperature", measurement: "°C" }],
        });
        return;
      }

      const groupedData: {
        [key: string]: { value: string; measurement: string }[];
      } = {};

      responseData.forEach((item) => {
        if (!groupedData[item.category]) groupedData[item.category] = [];
        groupedData[item.category].push({
          value: item.value,
          measurement: item.measurement,
        });
      });

      setCategories(groupedData);
    } catch (error) {
      console.error("Error fetching data types:", error);
      setCategories({
        Health: [{ value: "Heart Rate", measurement: "bpm" }],
        Home: [{ value: "Temperature", measurement: "°C" }],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataTypes();
  }, []);

  const addDataType = async () => {
    const categoryToUse = customCategory ? newCategory : selectedCategory;
    const newEntry = {
      wallet_id: walletInfo.address,
      device_id: newDataType
    };
    console.log(`${walletInfo.address}/data_type`);

    try {
      setLoading(true);
      const response = await fetch("http://75.131.29.55:5100/add-device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });

      const responseData = await response.json(); // Read response


      if (response.ok) {
        Alert.alert("Success", "New data type added!");


        setCategories((prevCategories) => {
          const updatedCategories = { ...prevCategories };
          if (!updatedCategories[categoryToUse]) {
            updatedCategories[categoryToUse] = [];
          }
          updatedCategories[categoryToUse].push({
            value: newDataType,
            measurement,
          });
          return updatedCategories;
        });

        setNewDataType("");
        setSelectedCategory("");
        setNewCategory("");
        setMeasurement("");
        setCustomCategory(false);
        setModalVisible(false);
      } else {
        Alert.alert("Error", "Failed to add data type.");
      }
    } catch (error) {
      console.error("Error adding data type:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.welcomeCard}>
        <Card.Content style={styles.welcomeCardContent}>
          <Text style={styles.welcomeText}>Hello, User!</Text>
          <MaterialCommunityIcons
            name="account-circle"
            size={40}
            color="black"
          />
        </Card.Content>
      </Card>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.categoryRow}>
          {Object.keys(categories).map((category, index) => (
            <Surface key={index} style={styles.cluster}>
              <Title style={styles.clusterTitle}>{category}</Title>
              {categories[category].map((data, idx) => (
                <Card
                  key={idx}
                  style={styles.card}
                  onPress={() =>
                    router.push(
                      `/datatypes/${encodeURIComponent(
                        data.value
                      )}?measurementUnit=${encodeURIComponent(
                        data.measurement
                      )}`
                    )
                  }
                >
                  <Card.Content style={styles.row}>
                    <MaterialCommunityIcons
                      name="chart-bar"
                      size={30}
                      color="white"
                    />
                    <View style={styles.cardTextContainer}>
                      <Subheading style={styles.cardText}>
                        {data.value}
                      </Subheading>
                      <Text style={styles.label}>
                        Measurement: {data.measurement}
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              ))}
            </Surface>
          ))}
        </View>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        color="white"
        onPress={() => setModalVisible(true)}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
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
              <Picker.Item
                style={styles.picker}
                label="Select a Category"
                value=""
              />
              {Object.keys(categories).map((category, index) => (
                <Picker.Item key={index} label={category} value={category} />
              ))}
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
                onPress={addDataType}
                color="#2196F3"
                disabled={loading}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0", // Light gray background for clean look
  },

  scrollContainer: {
    padding: 20,
  },

  welcomeCard: {
    alignSelf: "center",
    marginVertical: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 3,
  },

  welcomeCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
  },

  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap", // Ensures wrapping on small screens
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },

  cluster: {
    width: "48%", // Make each category take half the width
    marginBottom: 15,
    padding: 30,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    elevation: 3,
  },

  clusterTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  card: {
    marginBottom: 10,
    backgroundColor: "#2196F3", // Blue card background
    borderRadius: 8,
    padding: 10,
    elevation: 2,
  },

  cardTextContainer: {
    marginLeft: 10,
  },

  cardText: {
    fontSize: 16,
    color: "white", // Ensures text inside cards is white
  },

  label: {
    fontSize: 14,
    color: "white", // Ensures label text is white
  },

  formlabel: {
    fontSize: 14,
    marginVertical: 15,
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#2196F3",
    borderRadius: 50,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
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

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
});
