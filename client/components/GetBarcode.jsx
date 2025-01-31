import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  Image,
  Modal,
  TouchableOpacity,
  Animated,
} from "react-native";
import { setUser, setIsLogged } from "../redux/slices/auth";
import { BlurView } from "expo-blur";
import { useDispatch } from "react-redux";
import CustomButton from "../components/CustomButton";
import { getProductName } from "../routes/product_api";
import ProductCard from "./ProductCard";
import { icons } from "../constants";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateDisplay from "./DateDisplay";
import { createProduct } from "../routes/product_api";
import { router } from "expo-router";
import { CameraView, Camera } from "expo-camera";
import { Audio } from "expo-av";
import LottieView from "lottie-react-native";
import { gifs, audio } from "../constants";
import { addProduct } from "../redux/slices/products";
const GetBarcode = () => {
  const [imageUri, setImageUri] = useState(null);
  const [code, setCode] = useState(null);
  const [showExpPhotoPicker, setExpPhotoPicker] = useState(false);
  const [productName, setProductName] = useState("");
  const [expDate, setExpDate] = useState("");
  const [priceImageUri, setPriceImageUri] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [status, setStatus] = useState("");
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [linePosition] = useState(new Animated.Value(30));
  const [sound, setSound] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [isFakeProductScannedOnce, setIsFakeProductScannedOnce] =
    useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();

    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(audio.beep);
      setSound(sound);
    };
    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (!scanned) {
      startLineAnimation();
    }
  }, [scanned]);

  const startLineAnimation = () => {
    linePosition.setValue(30);
    Animated.loop(
      Animated.sequence([
        Animated.timing(linePosition, {
          toValue: 157,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(linePosition, {
          toValue: 30,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleBarcodeScanned = async ({ type, data }) => {
    setScanned(true);
    if (sound) {
      await sound.replayAsync();
    }
    setCode(data);
    setProcessing(true);
    handleDone(data);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleDone = async (code) => {
    setIsPopupVisible(false);

    try {
      const result = await getProductName(code);
      setImageUri(result.image);
      setProductName(result.name);
      setExpPhotoPicker(true);
      setProcessing(false);
    } catch (error) {
      if (!isFakeProductScannedOnce) {
        setIsFakeProductScannedOnce(true);
        Alert.alert(
          "Alert",
          "The product you selected was not found in our database. For confirmation, please try scanning again one time."
        );
      } else {
        Alert.alert(
          "Alert",
          "The product you selected was not found in our database, Try to add Item Manually."
        );
      }
      setProcessing(false);
    }
  };

  const handleDateChange = (event, date) => {
    setShowPicker(false);
    if (date) {
      setSelectedDate(date);

      const formattedDate = `${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()}`;
      setExpDate(formattedDate);

      const currentDate = new Date();
      const diffInTime = date.getTime() - currentDate.getTime();
      const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));

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

      dispatch(setUser(result.user));
      dispatch(addProduct(result.product));
      router.push("/home");
    } catch (err) {
      console.error("Error submitting product:", err);
      Alert.alert("Error", "Failed to submit product.");
    }
  };

  // const formattedDateString = `${formattedDate.day}/${formattedDate.month}/${formattedDate.year}`;

  return (
    <View className="items-center h-full px-2 py-3 ">
      <Text className="text-shadow-sm text-2xl font-pbold text-territory-100 mb-3">
        Add Product
      </Text>
      <ProductCard
        image={imageUri}
        name={productName}
        expDate={expDate}
        status={status}
        onDelete
      />
      <View className="relative">
        {!scanned ? (
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["ean13", "ean8", "ean12"],
            }}
            className="w-[300px] h-[230px] mt-3 rounded-2xl relative"
          />
        ) : processing ? (
          <LottieView
            className="w-[180px] h-[170px] mt-3"
            source={gifs.processing}
            autoPlay
            loop
          />
        ) : productName === "" ? (
          <LottieView
            className="w-[180px] h-[170px] mt-3"
            source={gifs.fake_product}
            autoPlay
            loop
          />
        ) : (
          <LottieView
            className="w-[180px] h-[170px] mt-3"
            source={gifs.success}
            autoPlay
            loop
          />
        )}
        {/* Moving Line */}
        {!scanned && (
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "79.8%",
              height: 2,
              backgroundColor: "red",
              transform: [{ translateY: linePosition }],
            }}
          />
        )}
      </View>

      <CustomButton
        title="Scan Bar Code Again"
        handlePress={() => setScanned(false)}
        containerStyles="w-[60%] rounded-[10px] min-h-[40px] mt-3 bg-secondary-200"
        disabled={!scanned}
      />

      <TouchableOpacity
        onPress={() => takePicture("exp-date")}
        className="w-full mt-12 items-center"
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
                source={icons.camera}
                resizeMode="contain"
                className="w-6 h-6"
              />
              <Text className="text-md font-semibold text-secondary-100 font-pmedium ml-2">
                Take a photo of Expiry Date
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
            containerStyles="w-[75%] rounded-[10px] min-h-[50px] bg-secondary-200"
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
          containerStyles="w-[40%] py-2 rounded-full bg-secondary-100 mt-5 bg-secondary-200"
        />
      )}
    </View>
  );
};

export default GetBarcode;
