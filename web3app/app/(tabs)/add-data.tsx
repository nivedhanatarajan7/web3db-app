import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

export default function AddPage() {
  const [datatype, changeDataType] = useState("blood_pressure");
  const [hr, setHr] = useState("");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const validateInputs = () => {
    if (datatype === "blood_pressure_test") {
      if (!systolic || !diastolic || !date || !time) {
        Alert.alert("Error", "Please fill in all fields.");
        return false;
      }
    } else if (datatype === "heart_rate") {
      if (!hr || !date || !time) {
        Alert.alert("Error", "Please fill in all fields.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    const data = {
      type: datatype,
        ...(datatype === "heart_rate"
        ? { bpm: hr }
        : { sys: systolic, dia: diastolic }),
    };

    try {
      const response = await axios.post("http://172.20.24.155:5100/add-medical", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      Alert.alert("Success", "Medical data added successfully!");
      console.log("Response:", response.data);
      // Reset fields after successful submission
      setHr("");
      setSystolic("");
      setDiastolic("");
      setDate("");
      setTime("");
    } catch (error: any) {
      console.error("Error:", error.message);
      Alert.alert("Error", "Failed to add medical data. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 40, fontWeight: "bold" }}>Add Medical Data</Text>

      <Text style={styles.header}>Medical Data Type</Text>
      <Picker
        selectedValue={datatype}
        onValueChange={(itemValue) => changeDataType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Blood Pressure" value="blood_pressure_test" />
        <Picker.Item label="Heart Rate" value="heart_rate" />
      </Picker>

      {datatype === "blood_pressure_test" ? (
        <View>
          <Text style={styles.header}>Systolic Blood Pressure (mm Hg)</Text>
          <TextInput
            style={styles.input}
            placeholder="120"
            keyboardType="numeric"
            value={systolic}
            onChangeText={setSystolic}
          />
          <Text style={styles.header}>Diastolic Blood Pressure (mm Hg)</Text>
          <TextInput
            style={styles.input}
            placeholder="80"
            keyboardType="numeric"
            value={diastolic}
            onChangeText={setDiastolic}
          />
        </View>
      ) : (
        <View>
          <Text style={styles.header}>Heart Rate (BPM)</Text>
          <TextInput
            style={styles.input}
            placeholder="Heart Rate"
            keyboardType="numeric"
            value={hr}
            onChangeText={setHr}
          />
        </View>
      )}

      <Text style={styles.header}>Date of Test</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={date}
        onChangeText={setDate}
      />

      <Text style={styles.header}>Time of Test</Text>
      <TextInput
        style={styles.input}
        placeholder="HH:MM:SS"
        value={time}
        onChangeText={setTime}
      />

      <Button title="Add Data" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#f5f5f5",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    backgroundColor: "white",
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "#ffffff",
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
