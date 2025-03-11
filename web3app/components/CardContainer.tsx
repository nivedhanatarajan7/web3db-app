import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCard from './MaterialCard'; // Adjust the path as necessary
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Card = {
  mainText: string;
  subText: string;
  isActive: boolean;
};

type CardContainerProps = {
  title: string;
  onCardPress: (mainText: string, subText: string) => void;
};

const CardContainer: React.FC<CardContainerProps> = ({ title, onCardPress }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [cards, setCards] = useState<Card[]>([
    { mainText: "Main Text 1", subText: "Subtext 1", isActive: true },
    { mainText: "Main Text 2", subText: "Subtext 2", isActive: true },
    { mainText: "Main Text 3", subText: "Subtext 3", isActive: true },
    { mainText: "Main Text 4", subText: "Subtext 4", isActive: true },
    { mainText: "Main Text 5", subText: "Subtext 5", isActive: true },
  ]);

  // Add empty cards to ensure there are always 6 cards
  while (cards.length < 6) {
    cards.push({ mainText: "Create New Card", subText: "Insert Data", isActive: false });
  }

  const onEditPress = () => {
    console.log('Edit button pressed');
    setIsEditing(!isEditing);
  };

  const onEditCardPress = (index: number) => {
    const updatedCards = cards.filter((_, i) => i !== index);
/*     updatedCards.push({ mainText: "", subText: "", isActive: false });
 */    setCards(updatedCards);
  };

  return (
    <View style={styles.innerContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.innerContainerTitle} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
        <TouchableOpacity style={styles.button} onPress={onEditPress}>
          <MaterialCommunityIcons name={isEditing ? 'check' : 'pencil'} size={16} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardsContainer}>
        {cards.map((card, index) => (
          <View key={index} style={styles.cardWrapper}>
            <MaterialCard
              mainText={card.mainText}
              subText={card.subText}
              onPress={isEditing ? () => onEditCardPress(index) : onCardPress}
              isEditing={isEditing}
              isActive={card.isActive}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    flexBasis: '30%', // Ensure three items per row
    flexDirection: 'column',
    marginHorizontal: 20,
    paddingBottom: 20,
    height: 'auto',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
    marginBottom: 8,
  },
  innerContainerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#4da6ff',
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48%', // Adjust the width to fit two cards per row with some spacing
    marginBottom: 0,
  },
});

export default CardContainer;