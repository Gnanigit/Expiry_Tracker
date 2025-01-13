import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  Image,
  Modal,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "../components/CustomButton";
import { getBarcodeNumber, getProductName } from "../routes/product_api";
import ProductCard from "./ProductCard";
import { icons } from "../constants";

const GetBarcode = () => {
  const [imageUri, setImageUri] = useState(null);
  const [code, setCode] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [editedCode, setEditedCode] = useState("");
  const [productName, setProductName] = useState("");
  const [expDate, setExpDate] = useState("");
  const [priceImageUri, setPriceImageUri] = useState("");
  // Function to take a picture using the camera
  const takePicture = async (flag) => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Denied", "We need access to your camera.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        quality: 1,
      });
      // const result = await ImagePicker.launchCameraAsync({
      //   mediaTypes: [ImagePicker.MediaType.IMAGE], // Updated to use MediaType array
      //   allowsEditing: true,
      //   quality: 1,
      // });

      if (!result.canceled) {
        if (flag === "barcode") {
          setImageUri(result.assets[0].uri);
        } else {
          setPriceImageUri(result.assets[0].uri);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take a picture.");
    }
  };

  // Get Barcode Number
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
      setEditedCode(result.data);
      setIsPopupVisible(true);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleDone = async () => {
    setCode(editedCode);
    setIsPopupVisible(false);

    try {
      const result = await getProductName(editedCode);
      setImageUri(result.image);
      setProductName(result.description);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View className="flex-1 items-center px-2 py-3">
      <Text className="text-shadow-sm text-2xl font-pbold text-territory-100 ">
        Add Product
      </Text>
      <ProductCard
        image={imageUri}
        name={productName}
        expDate={expDate}
        status={"green"}
        onDelete
      />
      <TouchableOpacity
        onPress={() => takePicture("barcode")}
        className="w-full mt-4 items-center"
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            resizeMode="cover"
            className="w-48 h-48 rounded-xl"
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
              className="w-6 h-6"
            />
            <Text className="text-md font-semibold text-secondary-100 font-pmedium ml-2">
              Take a photo
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <CustomButton
        title="Get Code"
        handlePress={submit}
        containerStyles="w-[40%] rounded-[10px] min-h-[40px] mt-3"
      />

      {/* <View>
        <Text className="mt-4 text-lg text-gray-700">Barcode: {code}</Text>
      </View> */}

      {/* <TouchableOpacity
        className="w-full bg-secondary-100 py-3 rounded-md items-center"
        onPress={handleDone}
      >
        <Text className="text-white font-semibold">Done</Text>
      </TouchableOpacity> */}

      <Modal visible={isPopupVisible} transparent={true} animationType="fade">
        {/* Blur Overlay */}
        <View className="flex-1 relative">
          <BlurView
            intensity={90}
            className="h-full w-full absolute inset-0"
            tint="dark"
          />

          <View className="flex-1 justify-center items-center px-4">
            <View className="w-full bg-white p-6 rounded-lg items-center">
              <Image
                source={icons.addProduct}
                className="w-48 h-24 mb-4"
                resizeMode="contain"
              />
              <Text className="text-lg text-shadow-sm font-bold text-territory-100 mb-2">
                Enter or confirm your barcode:
              </Text>
              <TextInput
                className="w-full border border-secondary-100 rounded-md p-2 mb-4"
                value={editedCode}
                onChangeText={setEditedCode}
              />
              <TouchableOpacity
                className="w-full bg-secondary-100 py-3 rounded-md items-center"
                onPress={handleDone}
              >
                <Text className="text-white font-psemibold">Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        onPress={() => takePicture("exp-date")}
        className="w-full mt-4 items-center"
      >
        {imageUri &&
          (priceImageUri ? (
            <Image
              source={{ uri: priceImageUri }}
              resizeMode="contain"
              className="w-48 h-48 rounded-2xl"
            />
          ) : (
            <View
              className="bg-territory-100-40 border-territory-100 w-full h-20 rounded-2xl items-center justify-center flex-row"
              style={{
                borderWidth: 1.5,
                borderColor: "#F49F1C",
                borderStyle: "dashed",
                marginTop: -5,
              }}
            >
              <Image
                source={icons.upload}
                resizeMode="contain"
                className="w-6 h-6"
              />
              <Text className="text-md font-semibold text-secondary-100 font-pmedium ml-2">
                Take a photo
              </Text>
            </View>
          ))}
      </TouchableOpacity>
    </View>
  );
};

export default GetBarcode;
