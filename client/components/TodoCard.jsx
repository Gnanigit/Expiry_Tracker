import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Checkbox from "expo-checkbox";

const TodoCard = ({ name, weight, date }) => {
  const [isChecked, setChecked] = useState(false);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.weight}>{weight}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <Checkbox value={isChecked} onValueChange={setChecked} />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  weight: {
    fontSize: 16,
    color: "gray",
  },
  date: {
    fontSize: 14,
    color: "#555",
  },
});

export default TodoCard;
