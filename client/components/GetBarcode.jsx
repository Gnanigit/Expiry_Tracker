import React, { useEffect, useState } from "react";
import { View, Text, Alert, Image, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "../components/CustomButton";
import { getBarcodeNumber } from "../routes/api";

const GetBarcode = () => {
  const [imageUri, setImageUri] = useState(null);
  const [code, setCode] = useState([]);

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Denied", "We need access to your gallery.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick an image.");
    }
  };

  const submit = async () => {
    if (!imageUri) {
      Alert.alert("No Image", "Please select an image first.");
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
      console.log(result);
      setCode(result);

      // Alert.alert("Result", result);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  useEffect(() => {
    console.log(code);
  }, [code]);

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
    <SafeAreaView className="bg-primary h-full w-full pt-4">
      <View className="w-full items-center">
        <Text>Barcode Reader</Text>
        <CustomButton
          title="Pick Image"
          handlePress={pickImage}
          containerStyles="w-[50%] rounded-[50px] min-h-[55px]"
        />
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={{ width: 200, height: 200, marginBottom: 20 }}
          />
        )}

        <CustomButton
          title="Get Code"
          handlePress={submit}
          containerStyles="w-[50%] rounded-[50px] min-h-[55px]"
        />
        <View className="mt-20">
          <Text>Data Display</Text>
          <FlatList
            data={code}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>

        {/* <Text>{code}</Text> */}
      </View>
    </SafeAreaView>
  );
};

export default GetBarcode;
