import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Animated } from 'react-native';
import CardContainer from '../../components/CardContainer'; // Adjust the path as necessary
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HomeAssistant() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<{ mainText: string; subText: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleCardPress = (mainText: string, subText: string) => {
    setSelectedCard({ mainText, subText });
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 10, // Instant duration
      useNativeDriver: true,
    }).start();
  };

  const handleCloseModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 10, // Instant duration
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedCard(null);
    });
  };

  const handleEditPress = () => {
    setIsEditing(!isEditing);
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
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Welcome to Home Assistant</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
            <MaterialCommunityIcons name={isEditing ? 'check' : 'pencil'} size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.outerContainer}>
          {cardContainers.map((container, index) => (
            <CardContainer key={index} title={container.title} onCardPress={handleCardPress} isEditing={isEditing} />
          ))}
        </View>
        {selectedCard && (
          <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={handleCloseModal}
          >
            <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
              <View style={styles.modalContent}>
                <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
                <Text style={styles.modalMainText}>{selectedCard.mainText}</Text>
                <Text style={styles.modalSubText}>{selectedCard.subText}</Text>
              </View>
            </Animated.View>
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
    alignItems: 'center',
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    flex: 1,
  },
  editButton: {
    backgroundColor: '#4da6ff',
    padding: 10,
    borderRadius: 100,
    marginRight: 40,
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