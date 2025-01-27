import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import AvatarComponent from "../../components/AvatarComponent";
import { updateUserDetails } from "../../routes/auth_api";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    products: user?.products?.length || 0,
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    address: user?.address || "",
    pincode: user?.pincode || "",
  });

  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleUpdate = async () => {
    try {
      const result = await updateUserDetails(formData);
      dispatch(setUser(result));
      dispatch(setIsLogged(true));
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />
      <Navbar toggleSidebar={toggleSidebar} />
      <ScrollView className="flex-1 px-4 mt-4 ">
        <View className="items-center justify-between">
          <View className="items-center justify-center">
            <View className="w-36 h-36 border border-secondary rounded-full justify-center items-center">
              {user?.avatar ? (
                <AvatarComponent
                  className="w-[90%] h-[90%] rounded-lg"
                  avatar={user?.avatar}
                  resizeMode="contain"
                />
              ) : (
                <ActivityIndicator size="small" color="#fff" />
              )}
            </View>
            <View className="w-full flex-row gap-x-12">
              <Text className="text-sm text-secondary font-pmedium text-center mt-3">
                {user?.username}
              </Text>
              <Text className="text-sm text-territory font-pmedium text-center mt-3">
                {formData?.products} products
              </Text>
            </View>
          </View>

          <View className="mt-4 w-full">
            <FormField
              title="Email"
              placeholder="Email"
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              otherStyles="mb-3"
              titleStyle="text-sm text-black-100 font-psmedium"
              inputViewStyle="w-full bg-primary border-2 px-2 h-12 border-gray-300 rounded-xl focus:border-secondary"
            />

            <FormField
              title="First Name"
              placeholder="Add your First Name"
              value={formData.firstName}
              onChangeText={(value) => handleInputChange("firstName", value)}
              otherStyles="mb-3"
              titleStyle="text-sm text-black-100 font-psmedium"
              inputViewStyle="w-full bg-primary border-2 px-2 h-12 border-gray-300 rounded-xl focus:border-secondary"
            />
            <FormField
              title="Last Name"
              placeholder="Add your Last Name"
              value={formData.lastName}
              onChangeText={(value) => handleInputChange("lastName", value)}
              otherStyles="mb-3"
              titleStyle="text-sm text-black-100 font-psmedium"
              inputViewStyle="w-full bg-primary border-2 px-2 h-12 border-gray-300 rounded-xl focus:border-secondary"
            />
            <FormField
              title="Address"
              placeholder="Add your Address"
              value={formData.address}
              onChangeText={(value) => handleInputChange("address", value)}
              otherStyles="mb-3"
              titleStyle="text-sm text-black-100 font-psmedium"
              inputViewStyle="w-full bg-primary border-2 px-2 h-12 border-gray-300 rounded-xl focus:border-secondary"
            />
            <FormField
              title="Pincode"
              placeholder="Add your Pincode"
              value={formData.pincode}
              onChangeText={(value) => handleInputChange("pincode", value)}
              otherStyles="mb-3"
              titleStyle="text-sm text-black-100 font-psmedium"
              inputViewStyle="w-full bg-primary border-2 px-2 h-12 border-gray-300 rounded-xl focus:border-secondary"
            />
          </View>
          <CustomButton
            title="Update Profile"
            handlePress={handleUpdate}
            disabled={loading}
            containerStyles="w-[50%] rounded-xl min-h-[50px] mt-4 bg-territory-100 mb-2"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
