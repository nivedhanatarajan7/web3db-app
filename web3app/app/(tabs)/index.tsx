// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
// import { Card } from "react-native-paper";
// import axios from "axios";
// import { MaterialCommunityIcons } from "react-native-vector-icons";
// import { LineChart } from "react-native-chart-kit";
// import { AppRegistry } from 'react-native';



// // Mocked auth function
// const auth = async () => {
//   return {
//     user: {
//       name: "Jane Doe",
//       email: "example@email.com",
//     },
//   };
// };

// export default function HomePage() {
//   const [hrValues, setHrValues] = useState<number[]>([0]);
//   const [sbp, setSbp] = useState<number[]>([0]);
//   const [dbp, setDbp] = useState<number[]>([0]);
//   const [steps, setSteps] = useState(0);
//   const [calories, setCalories] = useState(0);

//   const [session, setSession] = useState<any>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       const sessionData = await auth();
//       setSession(sessionData);

//       // Fetch heart rate
//       fetchHeartRate();

//       // Fetch blood pressure
//       fetchBloodPressure();

//       // Fetch steps and calories
//       fetchStepsAndCalories();
//     };

//     fetchData();
//   }, []);

//   const fetchHeartRate = async () => {
//     const data = {
//       type: "heart_rate",
//     };
  
//     try {
//       const response = await axios.post("http://172.20.24.155:5100/fetch-medical", data, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
  
//       // Parse the response.data string into a JavaScript object
//       const heartRateData = JSON.parse(response.data); 
  
//       const heartRates = heartRateData.map((record: any) => parseFloat(record.bpm)); 
//       setHrValues(heartRates);
//     } catch (error) {
//       console.error("Error fetching heart rate data", error);
//     }
//   };

//   const fetchBloodPressure = async () => {
//     const data = {
//       type: "blood_pressure_test",
//     };
  
//     try {
//       const response = await axios.post("http://172.20.24.155:5100/fetch-medical", data, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
  
//       // Parse the response.data string into a JavaScript object
//       const bpData = JSON.parse(response.data); 
  
//       const sys = bpData.map((record: any) => parseFloat(record.sys)); 
//       setSbp(sys);
//       const dia = bpData.map((record: any) => parseFloat(record.dia)); 
//       setDbp(dia);
//     } catch (error) {
//       console.error("Error fetching heart rate data", error);
//     }
//   };

//   const calculateAverageBp = (data: any) => {
//     const totalSystolic = data.reduce((sum: number, record: any) => sum + Number(record.systolic), 0);
//     const totalDiastolic = data.reduce((sum: number, record: any) => sum + Number(record.diastolic), 0);
//     return {
//       systolic: totalSystolic / data.length,
//       diastolic: totalDiastolic / data.length,
//     };
//   };

//   const fetchStepsAndCalories = async () => {
//     try {
//       const response = await axios.post("http://172.20.24.155:5100/fetch-medical", { type: "steps" });
//       setSteps(response.data.steps || 0);
//       setCalories(response.data.calories || 0);
//     } catch (error) {
//       console.error("Error fetching steps data", error);
//     }
//   };

//   const calculateAverage = (arr: any) => {
//     if (arr.length === 0) {
//       return 0; // Or handle the case of an empty array as needed
//     }
//     const sum = arr.reduce((acc: any, val: any) => acc + val, 0);
//     return sum / arr.length;
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={{ fontSize: 40, fontWeight: "bold" }}>Summary</Text>

//       {/* Heart Health */}
//       <Card style={styles.card}>
//         <Card.Content>
//           <View style={{ flexDirection: "row" }}>
//             <MaterialCommunityIcons name="heart" size={30} color="red" />
//             <Text style={styles.heartheader}> Heart Health</Text>
//           </View>
//           <Text style={styles.label}>
//           Heart Rate Data: 
//           {hrValues.length > 0 
//             ? ` ${calculateAverage(hrValues)} bpm` 
//             : 'No data available'}
//         </Text>
//           <LineChart
//             data={{
//               labels: hrValues.map((_, index) => ``),
//               datasets: [{ data: hrValues }],
//             }}
//             width={Dimensions.get("window").width * 0.85} // 85% of screen width
//             height={200}
//             yAxisSuffix=""
//             chartConfig={chartConfig}
//             bezier
//             style={styles.chart}
//           />
//         </Card.Content>
//       </Card>

//       {/* Blood Pressure Information */}
//       <Card style={styles.card}>
//         <Card.Content>
//           <View style={{ flexDirection: "row" }}>
//             <MaterialCommunityIcons name="water" size={30} color="blue" />
//             <Text style={styles.bpheader}> Blood Pressure Information</Text>
//           </View>
//           <Text style={styles.label}>Systolic Blood Pressure: {calculateAverage(sbp)} mm Hg</Text>
//           <Text style={styles.label}>Diastolic Blood Pressure: {calculateAverage(dbp)} mm Hg</Text>
//         </Card.Content>
//       </Card>

//       Steps Information
//       <Card style={styles.card}>
//         <Card.Content>
//           <View style={{ flexDirection: "row" }}>
//             <MaterialCommunityIcons name="walk" size={30} color="purple" />
//             <Text style={styles.exerciseheader}> Exercise Information</Text>
//           </View>
//           <Text style={styles.label}>Total Steps: {steps} steps</Text>
//           <Text style={styles.label}>Total Calories Burned: {calories} cal</Text>
//           <LineChart
//             data={{
//               labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
//               datasets: [{ data: [80, 70, 70, 75, 80, 76, steps] }],
//             }}
//             width={Dimensions.get("window").width * 0.85} // 85% of screen width
//             height={200}
//             yAxisSuffix=""
//             chartConfig={chartConfig}
//             bezier
//             style={styles.chart}
//           />
//         </Card.Content>
//       </Card>
//     </ScrollView>
//   );
// }

// const chartConfig = {
//   backgroundGradientFrom: "#f5f5f5",
//   backgroundGradientTo: "#f5f5f5",
//   color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
//   labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//   strokeWidth: 2,
//   barPercentage: 0.8,
//   useShadowColorFromDataset: false,
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     paddingTop: 50,
//     backgroundColor: "#f5f5f5",
//   },
//   heartheader: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "red",
//   },
//   bpheader: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "blue",
//   },
//   exerciseheader: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "purple",
//   },
//   card: {
//     marginBottom: 20,
//     elevation: 2,
//     backgroundColor: "#ffffff",
//   },
//   label: {
//     fontSize: 16,
//     marginVertical: 4,
//   },
//   chartContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     width: "70%",
//   },
//   chart: {
//     marginVertical: "5%",
//     borderRadius: 16,
//   },
// });
import React, { useState, useEffect } from "react"; 
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Card } from "react-native-paper";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { LineChart } from "react-native-chart-kit";
import mqtt from "mqtt"; // Import mqtt library

// Mocked auth function
const auth = async () => {
  return {
    user: {
      name: "Jane Doe",
      email: "example@email.com",
    },
  };
};

export default function HomePage() {
  const [hrValues, setHrValues] = useState<number[]>([0]);
  const [sbp, setSbp] = useState<number[]>([0]);
  const [dbp, setDbp] = useState<number[]>([0]);
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);

  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const sessionData = await auth();
      setSession(sessionData);

      // Connect to the EMQX MQTT broker
      const client = mqtt.connect("ws://broker.emqx.io:8083/mqtt");

      client.on("connect", () => {
        console.log("Connected to MQTT Broker");

        // Subscribe to the topic that provides heart rate data
        client.subscribe("health/heart_rate", (err) => {
          if (err) {
            console.error("Error subscribing to topic", err);
          } else {
            console.log("Subscribed to heart_rate topic");
          }
        });

        // Subscribe to other topics if necessary
        client.subscribe("health/blood_pressure", (err) => {
          if (err) {
            console.error("Error subscribing to blood_pressure topic", err);
          } else {
            console.log("Subscribed to blood_pressure topic");
          }
        });

        client.subscribe("health/steps_calories", (err) => {
          if (err) {
            console.error("Error subscribing to steps_calories topic", err);
          } else {
            console.log("Subscribed to steps_calories topic");
          }
        });
      });

      client.on("message", (topic, message) => {
        if (topic === "health/heart_rate") {
          const heartRateData = JSON.parse(message.toString());
          const heartRates = heartRateData.map((record: any) => parseFloat(record.bpm)); 
          setHrValues(heartRates);
        }

        if (topic === "health/blood_pressure") {
          const bpData = JSON.parse(message.toString());
          const sys = bpData.map((record: any) => parseFloat(record.sys)); 
          setSbp(sys);
          const dia = bpData.map((record: any) => parseFloat(record.dia)); 
          setDbp(dia);
        }

        if (topic === "health/steps_calories") {
          const stepsData = JSON.parse(message.toString());
          setSteps(stepsData.steps || 0);
          setCalories(stepsData.calories || 0);
        }
      });

      return () => {
        // Clean up when the component unmounts
        client.end();
      };
    };

    fetchData();
  }, []);

  const calculateAverage = (arr: any) => {
    if (arr.length === 0) {
      return 0; // Or handle the case of an empty array as needed
    }
    const sum = arr.reduce((acc: any, val: any) => acc + val, 0);
    return sum / arr.length;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={{ fontSize: 40, fontWeight: "bold" }}>Summary</Text>

      {/* Heart Health */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={{ flexDirection: "row" }}>
            <MaterialCommunityIcons name="heart" size={30} color="red" />
            <Text style={styles.heartheader}> Heart Health</Text>
          </View>
          <Text style={styles.label}>
            Heart Rate Data: 
            {hrValues.length > 0 
              ? ` ${calculateAverage(hrValues)} bpm` 
              : 'No data available'}
          </Text>
          <LineChart
            data={{
              labels: hrValues.map((_, index) => ``),
              datasets: [{ data: hrValues }],
            }}
            width={Dimensions.get("window").width * 0.85} // 85% of screen width
            height={200}
            yAxisSuffix=""
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      {/* Blood Pressure Information */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={{ flexDirection: "row" }}>
            <MaterialCommunityIcons name="water" size={30} color="blue" />
            <Text style={styles.bpheader}> Blood Pressure Information</Text>
          </View>
          <Text style={styles.label}>Systolic Blood Pressure: {calculateAverage(sbp)} mm Hg</Text>
          <Text style={styles.label}>Diastolic Blood Pressure: {calculateAverage(dbp)} mm Hg</Text>
        </Card.Content>
      </Card>

      {/* Exercise Information */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={{ flexDirection: "row" }}>
            <MaterialCommunityIcons name="walk" size={30} color="purple" />
            <Text style={styles.exerciseheader}> Exercise Information</Text>
          </View>
          <Text style={styles.label}>Total Steps: {steps} steps</Text>
          <Text style={styles.label}>Total Calories Burned: {calories} cal</Text>
          <LineChart
            data={{
              labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              datasets: [{ data: [80, 70, 70, 75, 80, 76, steps] }],
            }}
            width={Dimensions.get("window").width * 0.85} // 85% of screen width
            height={200}
            yAxisSuffix=""
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#f5f5f5",
  backgroundGradientTo: "#f5f5f5",
  color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.8,
  useShadowColorFromDataset: false,
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#f5f5f5",
  },
  heartheader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "red",
  },
  bpheader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "blue",
  },
  exerciseheader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "purple",
  },
  card: {
    marginBottom: 20,
    elevation: 2,
    backgroundColor: "#ffffff",
  },
  label: {
    fontSize: 16,
    marginVertical: 4,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "70%",
  },
  chart: {
    marginVertical: "5%",
    borderRadius: 16,
  },
});
