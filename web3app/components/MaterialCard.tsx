import React, { useState } from 'react';
import { Card, Text, IconButton } from 'react-native-paper';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


type MaterialCardProps = {
  mainText: string;
  subText: string;
  onPress: (mainText: string, subText: string) => void;
};

const MaterialCard: React.FC<MaterialCardProps> = ({ mainText, subText, onPress }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Replace empty strings with a space to maintain card size
  const displayMainText = mainText === "" ? " " : mainText;
  const displaySubText = subText === "" ? " " : subText;

  // If both mainText and subText are empty, do not render the card
  if (mainText === "" && subText === "") {
    return null;
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={styles.view} // Ensure the parent View takes full width
    >
      <TouchableOpacity
        onPress={() => onPress(mainText, subText)}
        activeOpacity={1}
      >
        <Card style={[styles.card, isHovered && styles.cardHovered]}>
          <Card.Content style={styles.cardContent}>
            <MaterialCommunityIcons name="heart" size={20} color="red" style={styles.icon} />
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                {mainText}
              </Text>
              <Text style={styles.paragraph} numberOfLines={1} ellipsizeMode="tail">
                {subText}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </div>
  );
};

const styles = StyleSheet.create({
  view: {
    width: '100%', // Ensure the parent View takes full width
    marginVertical: 5, // Add vertical margin to separate cards
  },
  card: {
    marginVertical: 5,
    borderRadius: 8,
    elevation: 5,
    backgroundColor: '#fff',
    height: 'auto', // Allow height to be determined by content
  },
  cardHovered: {
    backgroundColor: '#f5f5f5',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 10,
  },
  icon: {
    marginHorizontal: 10, // Add margin to the right of the icon
    paddingTop: 0, // Remove padding from the top of the icon
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14, // Adjust font size to fit the smaller card
    fontWeight: 'bold',
  },
  paragraph: {
    fontSize: 12, // Adjust font size to fit the smaller card
    color: 'gray',
  },
});

export default MaterialCard;