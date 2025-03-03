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

export default function HomePage() {
  const router = useRouter();

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
    try {
      setLoading(true);

      const response = await axios.post(
        "http://129.74.152.201:5100/get-medical",
        {
          time: "2 days",
          topic: "data_type",
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
    if (
      !newDataType.trim() ||
      !selectedCategory.trim() ||
      !measurement.trim()
    ) {
      return Alert.alert("Error", "Please fill in all fields!");
    }

    const newEntry = {
      type: "data_type",
      value: newDataType,
      category: selectedCategory,
      measurement: measurement,
    };

    try {
      setLoading(true);
      const response = await fetch("http://129.74.152.201:5100/add-medical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });

      if (response.ok) {
        Alert.alert("Success", "New data type added!");

        setCategories((prevCategories) => {
          const updatedCategories = { ...prevCategories };
          if (!updatedCategories[selectedCategory]) {
            updatedCategories[selectedCategory] = [];
          }
          updatedCategories[selectedCategory].push({
            value: newDataType,
            measurement: measurement,
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
        {Object.keys(categories).map((category, index) => (
          <Surface key={index} style={styles.cluster}>
            <Title style={styles.clusterTitle}>{category}</Title>
            {categories[category].map((data, idx) => (
              <Card
                key={idx}
                style={styles.card}
                onPress={() => {
                  console.log(
                    "Navigating to:",
                    data.value,
                    "with measurement:",
                    data.measurement
                  );
                  router.push(
                    `/datatypes/${encodeURIComponent(
                      data.value
                    )}?measurementUnit=${encodeURIComponent(data.measurement)}`
                  );
                }}
              >
                <Card.Content style={styles.row}>
                  <MaterialCommunityIcons
                    name="chart-bar"
                    size={30}
                    color="gray"
                  />
                  <View style={styles.cardText}>
                    <Subheading>{data.value}</Subheading>
                    <Text style={styles.label}>
                      Measurement: {data.measurement}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </Surface>
        ))}
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
          <Text style={styles.label}>Data Type</Text>

            <TextInput
              placeholder="Data Type Name"
              style={styles.input}
              value={newDataType}
              onChangeText={setNewDataType}
            />

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Category</Text>
              <Picker
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
                style={styles.picker}
              >
                <Picker.Item label="Select a Category" value="" />
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
            </View>

            <Text style={styles.label}>Measurement Units</Text>

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
    backgroundColor: "#f5f5f5",
  },
  inputContainer: {
    marginBottom: 15,
  },
  
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  
  picker: {
    backgroundColor: "white",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  
  input: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },  
  scrollContainer: {
    padding: 20,
  },
  cluster: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    elevation: 3,
  },
  clusterTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    marginBottom: 10,
    backgroundColor: "#D9EAFD",
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardText: {
    marginLeft: 10,
  },
  label: {
    fontSize: 14,
    color: "gray",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#2196F3",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  welcomeCard: {
    width: "50%",
    alignContent: "center",
    marginHorizontal: "auto",
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

  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
