import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Animated, Alert, Image, ScrollView } from "react-native";
import CustomButton from "./CustomButton";
import { Camera, CameraView } from "expo-camera";
import { Audio } from "expo-av";
import LottieView from "lottie-react-native";
import { audio } from "../constants";
import { getProductName } from "../routes/product_api";
import { gifs } from "../constants";

const FakeOrNot = () => {
  const [sound, setSound] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [linePosition] = useState(new Animated.Value(25));
  const [scanned, setScanned] = useState(false);
  const [product, setProduct] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [isFakeProductScannedOnce, setIsFakeProductScannedOnce] =
    useState(false);

  useEffect(() => {
    let isMounted = true;
    let soundObject;

    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (isMounted) setHasPermission(status === "granted");
    };

    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(audio.beep);
        soundObject = sound;
        if (isMounted) setSound(soundObject);
      } catch (error) {
        console.error("Error loading sound:", error);
      }
    };

    getCameraPermissions();
    loadSound();

    return () => {
      isMounted = false;
      if (soundObject) {
        soundObject
          .unloadAsync()
          .catch((error) => console.error("Error unloading sound:", error));
      }
    };
  }, []);

  useEffect(() => {
    if (!scanned) {
      startLineAnimation();
    }
  }, [scanned]);

  const startLineAnimation = () => {
    linePosition.setValue(25);
    Animated.loop(
      Animated.sequence([
        Animated.timing(linePosition, {
          toValue: 225,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(linePosition, {
          toValue: 25,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleBarcodeScanned = useCallback(
    async ({ type, data }) => {
      setScanned(true);
      if (sound) {
        await sound.replayAsync(); // Play the beep sound
      }
      setProcessing(true);
      handleDone(data);
    },
    [sound]
  );

  const handleDone = async (code) => {
    try {
      const result = await getProductName(code);
      setProduct(result);
      setProcessing(false);
      setIsFakeProductScannedOnce(false);
    } catch (error) {
      setProduct(null);
      if (!isFakeProductScannedOnce) {
        setIsFakeProductScannedOnce(true);
        Alert.alert(
          "Fake Product",
          "The product you selected is fake. Try scanning again to confirm."
        );
      } else {
        Alert.alert(
          "Fake Product",
          "This product is not found in our database."
        );
      }
      setProcessing(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View className="justify-center w-full h-full items-center">
        <LottieView
          className="w-[150px] h-[150px] mt-3"
          source={gifs.loading}
          autoPlay
          loop
        />
      </View>
    );
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: "center",
        marginTop: 10,
        paddingBottom: 70,
      }}
    >
      <Text className="text-lg text-shadow-sm text-center font-pbold text-territory-100">
        Check product Fake or not
      </Text>
      <View className="relative">
        {!scanned ? (
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ["ean13", "ean8"] }}
            className="w-[300px] h-[230px] mt-3 rounded-2xl relative"
          />
        ) : processing ? (
          <LottieView
            className="w-[180px] h-[170px] mt-3"
            source={gifs.processing}
            autoPlay
            loop
          />
        ) : product === null ? (
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
        {!scanned && (
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "76.5%",
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
        fontStyles="font-pregular"
      />
      {product !== null && (
        <View
          className="bg-territory-100-40 rounded-2xl items-center mt-5 mx-2 px-2 py-2"
          style={{
            borderWidth: 1.5,
            borderColor: "#F49F1C",
            borderStyle: "dashed",
            elevation: 4,
          }}
        >
          <View className="flex-row items-center w-full gap-2">
            <Image
              source={{ uri: product?.image }}
              className="w-36 h-36 rounded-md mb-4"
              resizeMode="contain"
            />
            <View className="flex-1">
              <Text
                className="text-md font-psemibold text-secondary text-shadow-sm mb-2"
                numberOfLines={7}
              >
                {product?.name}
              </Text>
              <Text className="text-sm text-gray-600 mb-4">
                <Text className="font-psemibold">Category: </Text>
                {product?.category}
              </Text>
              <Text className="text-sm text-gray-600 mb-4">
                <Text className="font-psemibold">EAN: </Text>
                {product?.ean}
              </Text>
            </View>
          </View>
          <Text
            className="text-sm text-gray-700 leading-relaxed px-1"
            style={{ textAlign: "justify" }}
          >
            <Text className="font-psemibold">Description: </Text>
            {product?.description}
          </Text>

          <Text className="text-mg font-psemibold text-secondary text-shadow-sm mt-2 mb-1">
            Additional Info:{" "}
          </Text>
          {product?.additional_content ? (
            Array.isArray(product?.additional_content) ? (
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                {product.additional_content.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      width: "48%",
                      marginBottom: 8,
                    }}
                  >
                    <Text className="text-sm text-gray-600">
                      <Text className="font-psemibold text-gray-700">
                        {item.key}{" "}
                      </Text>
                      {item.value}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text>{product.additional_content}</Text>
            )
          ) : (
            <Text>No additional info available.</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default FakeOrNot;
