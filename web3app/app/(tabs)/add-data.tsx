import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import "./form.css"

export default function AddPage() {
  const [datatype, changeDataType] = useState("blood_pressure");
  const [hr, setHr] = useState("");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = async () => {
    const mtype = datatype;
    if (datatype === "heart_rate") {
      const data = { type: mtype, bpm: hr };
      await axios
        .post("http://172.22.113.49:5000/add-medical", data)
        .then(() => Alert.alert("Success", "Heart rate data added!"))
        .catch(() => Alert.alert("Error", "Error in connection"));
    } else {
      const data = { type: mtype, sys: systolic, dist: diastolic };
      await axios
        .post("http://172.22.113.49:5000/add-medical", data)
        .then(() => Alert.alert("Success", "Blood pressure data added!"))
        .catch(() => Alert.alert("Error", "Error in connection"));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Medical Data Type:</Text>
      <Picker
        selectedValue={datatype}
        onValueChange={(itemValue) => changeDataType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Blood Pressure" value="blood_pressure" />
        <Picker.Item label="Heart Rate" value="heart_rate" />
      </Picker>

      {datatype === "blood_pressure" ? (
        <View>
          <Text style={styles.label}>Enter recent systolic blood pressure:</Text>
          <TextInput
            style={styles.input}
            placeholder="Systolic BP"
            keyboardType="numeric"
            value={systolic}
            onChangeText={(text) => setSystolic(text)}
          />
          <Text style={styles.label}>Enter recent diastolic blood pressure:</Text>
          <TextInput
            style={styles.input}
            placeholder="Diastolic BP"
            keyboardType="numeric"
            value={diastolic}
            onChangeText={(text) => setDiastolic(text)}
          />
        </View>
      ) : (
        <View>
          <Text style={styles.label}>Enter recent heart rate:</Text>
          <TextInput
            style={styles.input}
            placeholder="Heart Rate"
            keyboardType="numeric"
            value={hr}
            onChangeText={(text) => setHr(text)}
          />
        </View>
      )}

      <Text style={styles.label}>Date of Test:</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={date}
        onChangeText={(text) => setDate(text)}
      />

      <Text style={styles.label}>Time of Test:</Text>
      <TextInput
        style={styles.input}
        placeholder="HH:MM"
        value={time}
        onChangeText={(text) => setTime(text)}
      />

      <Button title="Add Data" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "#ffffff",
  },
});
