import { useRouter } from 'expo-router';
import { TouchableOpacity, ScrollView, Text, View, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

export default function HomePage() {
  const router = useRouter(); // Use Expo Router

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Heart Rate Card */}
      <TouchableOpacity onPress={() => router.push("/heart")}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.row}>
              <MaterialCommunityIcons name="heart" size={30} color="red" />
              <Text style={styles.cardHeader}>Heart Health</Text>
            </View>
            <Text style={styles.label}>Tap to view heart rate trends.</Text>
          </Card.Content>
        </Card>
      </TouchableOpacity>

      {/* Blood Pressure Card */}
      <TouchableOpacity onPress={() => router.push("/bp")}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.row}>
              <MaterialCommunityIcons name="water" size={30} color="blue" />
              <Text style={styles.cardHeader}>Blood Pressure</Text>
            </View>
            <Text style={styles.label}>Tap to view blood pressure details.</Text>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#f5f5f5" },
  card: { marginBottom: 20, elevation: 2, backgroundColor: "#ffffff", padding: 15 },
  row: { flexDirection: "row", alignItems: "center" },
  cardHeader: { fontSize: 20, fontWeight: "bold", marginLeft: 10 },
  label: { fontSize: 16, marginTop: 5, color: "gray" },
});
