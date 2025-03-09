import React, { useState } from 'react';
import { Card, Paragraph, Text } from 'react-native-paper';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

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
          <Card.Content>
            <Text style={styles.title}>{mainText}</Text>
            <Paragraph>{subText}</Paragraph>
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
  },
  cardHovered: {
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MaterialCard;