import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import CardContainer from '../../components/CardContainer'; // Adjust the path as necessary

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

  const cardContainers = [
    { title: 'Container 1' },
    { title: 'Container 2' },
    { title: 'Container 3' },
    { title: 'Container 4' },
    { title: 'Container 5' },
    { title: 'Container 6' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Welcome to Home Assistant</Text>
        <View style={styles.outerContainer}>
          {cardContainers.map((container, index) => (
            <CardContainer key={index} title={container.title} onCardPress={handleCardPress} />
          ))}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
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
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    paddingBottom: 20,
  },
  outerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center', // Center items vertically
    width: '100%',
    marginBottom: 20,
    flexWrap: 'wrap', // Allow containers to wrap to the next line
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