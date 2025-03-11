import React, { useState, useRef } from 'react';
import { Card, Text, IconButton } from 'react-native-paper';
import { StyleSheet, TouchableOpacity, View, Animated } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


type MaterialCardProps = {
  mainText?: string;
  subText?: string;
  icon?: string;
  color?: string;
  onPress: (mainText: string, subText: string) => void;
  isEditing: boolean;
  isActive?: boolean;
};

const MaterialCard: React.FC<MaterialCardProps> = ({ mainText = "Create New Card", subText = "Data", icon = 'heart', color = 'red', onPress, isEditing, isActive = 'true' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handleMouseEnter = () => {
    setIsHovered(true);
    Animated.spring(scaleValue, {
      toValue: 1.05,
      useNativeDriver: true,
    }).start();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const displayMainText = mainText === "" ? "default" : mainText;
  const displaySubText = subText === "" ? "default" : subText;

  const displayIcon = !isActive ? 'plus' : (isEditing ? 'delete' : icon);

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
        <Card style={[
          styles.card, 
          !isActive && styles.inactive,
          isHovered && styles.cardHovered, 
          isActive && isEditing && styles.activeCardEditing,
          !isActive && isEditing && styles.visibleWhenEditing,
        ]}>
          <Card.Content style={styles.cardContent}>
            <MaterialCommunityIcons name={displayIcon} size={20} color={isEditing ? 'gray' : color } style={styles.icon} />
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
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 5,
    backgroundColor: '#fff',
    height: 'auto', // Allow height to be determined by content
  },
  cardHovered: {
    backgroundColor: '#f5f5f5',
    transform: 'scale(1.05)',
  },
  activeCardEditing: {
    // e60000
    // #ff9999
    borderColor: '#ff9999', // Red border when editing
    shadowColor: '#ff9999', // Red shadow color when editing
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5, // Ensure elevation is applied for Android
  },
  inactive: {
    opacity: 0,
    pointerEvents: 'none',
  },
  visibleWhenEditing: {
    opacity: .8,
    pointerEvents: 'auto',
    display: 'flex',
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