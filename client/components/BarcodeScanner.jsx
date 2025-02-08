import { View, Text, Animated, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { CameraView, Camera } from "expo-camera";
import { Audio } from "expo-av";
import { getProductName } from "../routes/product_api";
import { audio } from "../constants";

const BarcodeScanner = ({ onProductScanned }) => {
  const [sound, setSound] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [linePosition] = useState(new Animated.Value(30));

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
          toValue: 220,
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

  const handleBarcodeScanned = async ({ data }) => {
    setScanned(true);
    if (sound) {
      await sound.replayAsync();
    }

    try {
      const result = await getProductName(data);
      onProductScanned(result.name); // Pass scanned product name to parent
    } catch (error) {
      Alert.alert(
        "Alert",
        "Product not found in database. Try scanning again or add manually."
      );
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    !scanned && (
      <View>
        <CameraView
          onBarcodeScanned={handleBarcodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["ean13", "ean8", "ean12"] }}
          className="w-[300px] h-[230px] mt-3 rounded-2xl relative"
        />
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "80%",
            height: 2,
            backgroundColor: "red",
            transform: [{ translateY: linePosition }],
          }}
        />
      </View>
    )
  );
};

export default BarcodeScanner;
