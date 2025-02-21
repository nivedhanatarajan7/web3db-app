import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';

type CardProps = {
  mainText: string;
  subText: string;
  onPress: (mainText: string, subText: string) => void;
};

const Card: React.FC<CardProps> = ({ mainText, subText, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(mainText, subText)} style={styles.card}>
      <Text style={styles.mainText}>{mainText}</Text>
      <Text style={styles.subText}>{subText}</Text>
    </TouchableOpacity>
  );
};

const InnerContainer: React.FC<{ title: string; onCardPress: (mainText: string, subText: string) => void }> = ({ title, onCardPress }) => {
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
      <Text style={styles.innerContainerTitle}>{title}</Text>
      <View style={styles.leftRightContainer}>
        <View style={styles.columnContainer}>
          {cards.slice(0, 3).map((card, index) => (
            <Card key={index} mainText={card.mainText} subText={card.subText} onPress={onCardPress} />
          ))}
        </View>
        <View style={styles.columnContainer}>
          {cards.slice(3).map((card, index) => (
            <Card key={index} mainText={card.mainText} subText={card.subText} onPress={onCardPress} />
          ))}
        </View>
      </View>
    </View>
  );
};

export default function HomeAssistant() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<{ mainText: string; subText: string } | null>(null);

  const handleCardPress = (mainText: string, subText: string) => {
    setSelectedCard({ mainText, subText });
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedCard(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Home Assistant</Text>
      <View style={styles.rowsContainer}>
        <View style={styles.outerContainer}>
          <InnerContainer title='Container 1' onCardPress={handleCardPress} />
          <InnerContainer title='Container 2' onCardPress={handleCardPress} />
          <InnerContainer title='Container 3' onCardPress={handleCardPress} />
        </View>
        <View style={styles.outerContainer}>
          <InnerContainer title='Container 4' onCardPress={handleCardPress} />
          <InnerContainer title='Container 5' onCardPress={handleCardPress} />
          <InnerContainer title='Container 6' onCardPress={handleCardPress} />
        </View>
      </View>
      {selectedCard && (
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
              <Text style={styles.modalMainText}>{selectedCard.mainText}</Text>
              <Text style={styles.modalSubText}>{selectedCard.subText}</Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  rowsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
  },
  outerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20, // Add some space between rows
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  innerContainerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
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
  card: {
    width: '100%',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  mainText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 14,
    color: 'gray',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
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
  modalMainText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubText: {
    fontSize: 18,
    color: 'gray',
  },
});