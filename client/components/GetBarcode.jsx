import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "../components/CustomButton";
import { getBarcodeNumber } from "../routes/api";
import ProductCard from "./ProductCard";
import { icons } from "../constants";

const GetBarcode = () => {
  const [imageUri, setImageUri] = useState(null);
  const [code, setCode] = useState([]);

  // Function to take a picture using the camera
  const takePicture = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Denied", "We need access to your camera.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take a picture.");
    }
  };

  const submit = async () => {
    if (!imageUri) {
      Alert.alert("No Image", "Please take a picture first.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "barcode.jpg",
      });
      const result = await getBarcodeNumber(formData);
      setCode(result);

      // Alert.alert("Result", result);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View>
        {Object.entries(item).map(([key, value]) => (
          <Text key={key}>
            {key}: {value}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View className="w-full items-center px-3">
      <Text className="text-shadow-sm text-2xl font-bold text-territory-100 mt-2">
        Add Product
      </Text>
      <ProductCard
        image={imageUri}
        name={"Drink"}
        expDate={"12-03-2025"}
        status={"red"}
        onDelete
      />
      <TouchableOpacity
        onPress={takePicture}
        className="w-full mt-2 items-center"
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            resizeMode="cover"
            className="w-56 h-56 rounded-2xl"
          />
        ) : (
          <View
            className="bg-territory-100-40 border-territory-100 w-full h-20 rounded-2xl items-center justify-center flex-row m+-5"
            style={{
              borderWidth: 1.5,
              borderColor: "#F49F1C",
              borderStyle: "dashed",
            }}
          >
            <Image
              source={icons.upload}
              resizeMode="contain"
              className="w-7 h-7"
            />
            <Text className="text-md font-semibold text-secondary-100 font-pmedium ml-2">
              Choose a file
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <CustomButton
        title="Get Code"
        handlePress={submit}
        containerStyles="w-[40%] rounded-[10px] min-h-[50px] mt-3"
      />

      <View className="mt-20">
        <Text>Data Display</Text>

        <FlatList
          data={code}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

export default GetBarcode;
