import React, { useState } from 'react';
import { Card, Text } from 'react-native-paper';
import { StyleSheet, TouchableOpacity } from 'react-native';

type MaterialCardProps = {
  mainText: string;
  subText: string;
  onPress: (mainText: string, subText: string) => void;
};

const MaterialCard: React.FC<MaterialCardProps> = ({ mainText, subText, onPress }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <TouchableOpacity
        onPress={() => onPress(mainText, subText)}
        activeOpacity={1}
      >
        <Card style={[styles.card, isHovered && styles.cardHovered]}>
          <Card.Content style={styles.cardContent}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {mainText}
            </Text>
            <Text style={styles.paragraph} numberOfLines={1} ellipsizeMode="tail">
              {subText}
            </Text>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </div>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    borderRadius: 8,
    elevation: 5,
    backgroundColor: '#fff',
    height: 'auto',
  },
  cardHovered: {
    backgroundColor: '#f5f5f5',
  },
  cardContent: {
    flexDirection: 'column',
    flex: 1,
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