import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCard from './MaterialCard'; // Adjust the path as necessary

type CardContainerProps = {
  title: string;
  onCardPress: (mainText: string, subText: string) => void;
};

const CardContainer: React.FC<CardContainerProps> = ({ title, onCardPress }) => {
  const cards = [
    { mainText: "Main Text 1", subText: "Subtext 1" },
    { mainText: "Main Text 2", subText: "Subtext 2" },
    { mainText: "Main Text 3", subText: "Subtext 3" },
    { mainText: "Main Text 4", subText: "Subtext 4" },
    { mainText: "Main Text 5", subText: "Subtext 5" },
    { mainText: "Main Text 6", subText: "Subtext 6" },
  ];

  return (
    <View style={styles.innerContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.innerContainerTitle} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.leftRightContainer}>
        <View style={styles.columnContainer}>
          {cards.slice(0, 3).map((card, index) => (
            <MaterialCard key={index} mainText={card.mainText} subText={card.subText} onPress={onCardPress} />
          ))}
        </View>
        <View style={styles.columnContainer}>
          {cards.slice(3).map((card, index) => (
            <MaterialCard key={index} mainText={card.mainText} subText={card.subText} onPress={onCardPress} />
          ))}
        </View>
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
  leftRightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  columnContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginHorizontal: 5,
  },
});

export default CardContainer;