import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCard from './MaterialCard'; // Adjust the path as necessary

type CardContainerProps = {
  title: string;
  onCardPress: (mainText: string, subText: string) => void;
};

const CardContainer: React.FC<CardContainerProps> = ({ title, onCardPress }) => {
  let cards = [
    { mainText: "Main Text 1", subText: "Subtext 1" },
    { mainText: "Main Text 2", subText: "Subtext 2" },
    { mainText: "Main Text 3", subText: "Subtext 3" },
    { mainText: "Main Text 4", subText: "Subtext 4" },
    { mainText: "Main Text 5", subText: "Subtext 5" },
  ];

  // Add empty cards to ensure there are always 6 cards
  while (cards.length < 6) {
    cards.push({ mainText: "", subText: "" });
  }

  return (
    <View style={styles.innerContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.innerContainerTitle} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardsContainer}>
        {cards.map((card, index) => (
          <View key={index} style={styles.cardWrapper}>
            <MaterialCard mainText={card.mainText} subText={card.subText} onPress={onCardPress} />
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
    marginHorizontal: 10,
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