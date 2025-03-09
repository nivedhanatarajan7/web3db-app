import React from 'react';
import { Card, Title, Paragraph } from 'react-native-paper';
import { StyleSheet } from 'react-native';

type MaterialCardProps = {
  mainText: string;
  subText: string;
  onPress: (mainText: string, subText: string) => void;
};

const MaterialCard: React.FC<MaterialCardProps> = ({ mainText, subText, onPress }) => {
  return (
    <Card style={styles.card} onPress={() => onPress(mainText, subText)}>
      <Card.Content>
        <Title>{mainText}</Title>
        <Paragraph>{subText}</Paragraph>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    borderRadius: 8,
    elevation: 5,
  },
});

export default MaterialCard;