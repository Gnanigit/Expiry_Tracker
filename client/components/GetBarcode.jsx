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
import DateTimePicker from "@react-native-community/datetimepicker";
import DateDisplay from "./DateDisplay";
import { createProduct } from "../routes/product_api";

const GetBarcode = () => {
  const [imageUri, setImageUri] = useState(null);
  const [code, setCode] = useState(null);
  const [showExpPhotoPicker, setExpPhotoPicker] = useState(false);
  const [editedCode, setEditedCode] = useState("");
  const [productName, setProductName] = useState("");
  const [expDate, setExpDate] = useState("");
  const [priceImageUri, setPriceImageUri] = useState("");

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [status, setStatus] = useState("");

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
      setExpPhotoPicker(true);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleDateChange = (event, date) => {
    setShowPicker(false);
    if (date) {
      setSelectedDate(date);

      // Format the selected date as DD/MM/YYYY
      const formattedDate = `${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()}`;
      setExpDate(formattedDate);

      // Calculate the difference in days between the current date and the selected date
      const currentDate = new Date();
      const diffInTime = date.getTime() - currentDate.getTime(); // Difference in milliseconds
      const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24)); // Convert to days
      console.log(diffInDays);

      if (diffInDays <= 7) {
        setStatus("red");
      } else if (diffInDays <= 40) {
        setStatus("yellow");
      } else {
        setStatus("green");
      }
    }
  };

  const formattedDate = {
    day: selectedDate.getDate(),
    month: selectedDate.getMonth() + 1,
    year: selectedDate.getFullYear(),
  };

  const handleSubmit = async () => {
    if (!productName || !imageUri || !expDate || !status) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const productData = {
      productName,
      imageUri,
      expDate,
      status,
    };
    try {
      const result = await createProduct(productData);
      console.log(result);
    } catch (err) {
      Alert.alert("Error", "Failed to submit product.");
    }
  };
  // const formattedDateString = `${formattedDate.day}/${formattedDate.month}/${formattedDate.year}`;

  return (
    <View className="flex-1 items-center px-2 py-3">
      <Text className="text-shadow-sm text-2xl font-pbold text-territory-100 ">
        Add Product
      </Text>
      <ProductCard
        image={imageUri}
        name={productName}
        expDate={expDate}
        status={status}
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
        title="Get Product Details"
        handlePress={submit}
        containerStyles="w-[50%] rounded-[10px] min-h-[40px] mt-3"
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
        {showExpPhotoPicker &&
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
      {showExpPhotoPicker && (
        <>
          <View className="flex-row items-center my-2">
            <View className="flex-1 h-[1px] bg-territory-100 mx-2" />
            <Text className="text-territory-100 font-pbold text-base">OR</Text>
            <View className="flex-1 h-[1px] bg-territory-100 mx-2" />
          </View>
          <CustomButton
            title="Select Expiry Date Manually"
            containerStyles="w-[70%] rounded-[10px] min-h-[50px] "
            handlePress={() => setIsPopupVisible(true)}
          />

          <Modal
            visible={isPopupVisible}
            transparent={true}
            animationType="fade"
          >
            <View className="flex-1 relative">
              <BlurView
                intensity={90}
                className="h-full w-full absolute inset-0"
                tint="dark"
              />
              <View className="flex-1 justify-center items-center px-4">
                <View className="w-full bg-white p-6 rounded-lg items-center">
                  <Text className="text-lg text-shadow-sm font-pbold text-territory-100 mb-4">
                    Select Expiry Date
                  </Text>

                  {/* Calendar Trigger */}
                  <TouchableOpacity
                    onPress={() => setShowPicker(true)}
                    className="w-full bg-secondary-100 py-3 rounded-md items-center mb-4"
                  >
                    <Text className="text-white font-psemibold">
                      Open Calendar
                    </Text>
                  </TouchableOpacity>

                  {/* Display Selected Date */}
                  <DateDisplay formattedDate={formattedDate} />

                  <CustomButton
                    title="Done"
                    handlePress={() => setIsPopupVisible(false)}
                    containerStyles="w-full py-3 rounded-md bg-secondary-100 mt-5"
                  />
                </View>
              </View>
            </View>
          </Modal>

          {showPicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </>
      )}

      {showExpPhotoPicker && (
        <CustomButton
          title="Add Product"
          handlePress={handleSubmit}
          containerStyles="w-[40%] py-2 rounded-full bg-secondary-100 mt-5"
        />
      )}
    </View>
  );
};

export default GetBarcode;
