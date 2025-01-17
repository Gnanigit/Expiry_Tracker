// import React, { useEffect, useState } from "react";
// import { View, Text, Alert, Image, FlatList } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Navbar from "../../components/Navbar";
// import Sidebar from "../../components/Sidebar";

// const Profile = () => {
//   const [isSidebarVisible, setIsSidebarVisible] = useState(false);
//   const toggleSidebar = () => {
//     setIsSidebarVisible(!isSidebarVisible);
//   };
//   return (
//     <SafeAreaView className="bg-primary h-full">
//       <Sidebar
//         isVisible={isSidebarVisible}
//         onClose={() => setIsSidebarVisible(false)}
//       />

//       <Navbar toggleSidebar={toggleSidebar} />

//       <View className="w-full items-center">
//         <Text className="text-lg text-shadow-sm font-pbold text-territory-100 mt-3">
//           Profile
//         </Text>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default Profile;

import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { CameraView, Camera } from "expo-camera";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8"],
        }}
        className="w-[300px] h-[300px]"
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});
