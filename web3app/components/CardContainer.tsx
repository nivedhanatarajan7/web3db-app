import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
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
  isEditing: boolean;
};

const CardContainer: React.FC<CardContainerProps> = ({ title, onCardPress, isEditing }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newMainText, setNewMainText] = useState('');
  const [newSubText, setNewSubText] = useState('');
  
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

  const onEditCardPress = (index: number) => {
    const updatedCards = cards.filter((_, i) => i !== index);
    setCards(updatedCards);
  };

  const onEditAddCardPress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setNewMainText('');
    setNewSubText('');
  };

  const handleAddCard = () => {
    const updatedCards = cards.filter(card => card.isActive);
    updatedCards.push({ mainText: newMainText, subText: newSubText, isActive: true });
    setCards(updatedCards);
    handleCloseModal();
  };

  return (
    <View style={styles.innerContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.innerContainerTitle} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
      </View>
      <View style={styles.cardsContainer}>
        {cards.map((card, index) => (
          <View key={index} style={styles.cardWrapper}>
            <MaterialCard
              mainText={card.mainText}
              subText={card.subText}
              onPress={
                isEditing
                  ? card.isActive
                    ? () => onEditCardPress(index)
                    : onEditAddCardPress
                  : () => onCardPress(card.mainText, card.subText)
              }
              isEditing={isEditing}
              isActive={card.isActive}
            />
          </View>
        ))}
      </View>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add New Card</Text>
            <TextInput
              style={styles.input}
              placeholder="Main Text"
              value={newMainText}
              onChangeText={setNewMainText}
            />
            <TextInput
              style={styles.input}
              placeholder="Sub Text"
              value={newSubText}
              onChangeText={setNewSubText}
            />
            <Button title="Add Card" onPress={handleAddCard} />
          </View>
        </View>
      </Modal>
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
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48%', // Adjust the width to fit two cards per row with some spacing
    marginBottom: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '40%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '50%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default CardContainer;