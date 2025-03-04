import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import LottieView from "lottie-react-native";
import Navbar from "../../components/Navbar";
import { Audio } from "expo-av";
import { transcribeSpeech } from "../../utils/transcribeSpeech";
import { gifs } from "../../constants";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import useWebFocus from "../../hooks/useWebFocus";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import TodoCard from "../../components/TodoCard";
import CustomButton from "../../components/CustomButton";
import { todo } from "../../routes/todo_api";
import { setTodos, addTodo } from "../../redux/slices/todo";
import { useDispatch } from "react-redux";

const create = () => {
  const { theme } = useSelector((state) => state.theme);
  const [transcribedSpeech, setTranscribedSpeech] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [todoItems, setTodoItems] = useState([]);
  const isWebFocused = useWebFocus();
  const audioRecordingRef = useRef(null);

  const dispatch = useDispatch();

  const handleStartRecording = () => {
    setIsRecording(true);
    startRecording();
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    stopRecording();
  };
  useEffect(() => {
    return () => {
      if (audioRecordingRef.current && isRecording) {
        audioRecordingRef.current.stopAndUnloadAsync().catch(console.error);
      }
    };
  }, []);

  const parseTodoItems = (text) => {
    const items = text.split(/\s*add\.?\s*/i).filter(Boolean);
    return items.map((item) => {
      const parts = item.trim().split(" ");
      const weight = parts.slice(-2).join(" ");
      const name = parts.slice(0, -2).join(" ");
      return {
        name,
        weight,
        date: new Date().toLocaleDateString(),
      };
    });
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to record audio is required!");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        android: {
          extension: ".wav",
          outputFormat: Audio.AndroidOutputFormat.WAV,
          audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: ".wav",
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      });

      await recording.startAsync();
      audioRecordingRef.current = recording;
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      setIsTranscribing(true);

      const recording = audioRecordingRef.current;
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      let uri = recording.getURI();

      if (!uri) {
        throw new Error("No audio URI found");
      }

      if (!uri.endsWith(".wav")) {
        uri = uri.replace(/\.\w+$/, ".wav");
      }

      const speechTranscript = await transcribeSpeech(uri);
      setTranscribedSpeech(speechTranscript || "");

      if (speechTranscript) {
        const parsedItems = parseTodoItems(speechTranscript);
        setTodoItems(parsedItems);
      }
    } catch (e) {
      console.error("Error stopping or transcribing recording", e);
    } finally {
      setIsTranscribing(false);
    }
  };

  const submit = async () => {
    if (todoItems.length === 0) {
      alert("No items to save.");
      return;
    }

    try {
      const result = await todo(todoItems);
      result.savedTodos.forEach((todo) => dispatch(addTodo(todo)));
    } catch (error) {
      alert("An error occurred while saving.");
    }
  };
  return (
    <SafeAreaView
      className={`${
        theme === "dark" ? "bg-primary-dark" : "bg-primary"
      } h-full`}
    >
      <Navbar type={"todo"} />
      <ScrollView className="p-3">
        <View className="space-y-3 items-center justify-center">
          <View>
            <Text className="text-shadow-sm text-center text-xl font-psemibold text-territory-100">
              Add Your Items
            </Text>
            <Text
              className={`text-center font-pmedium ${
                theme === "dark" ? "text-gray-200" : "text-gray-600"
              } `}
            >
              {"Speak (Example: Rice 1kg add)"}
            </Text>
          </View>
          <View
            className={`rounded-md h-40 m-3 w-[100%] p-2 ${
              theme === "dark" ? "bg-secondary-darkBox" : "bg-primary-100"
            }`}
            style={{
              borderColor: "rgba(94, 53, 177, 1)",
              borderWidth: 1,
              borderRadius: 10,
            }}
          >
            {isTranscribing ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text
                className={`font-pregular text-sm ${
                  theme === "dark" ? "text-gray-100" : "text-gray-600"
                }`}
              >
                {transcribedSpeech ||
                  "Your transcribed text will be shown here..."}
              </Text>
            )}
          </View>
          <View className="flex-row space-x-7">
            {!isRecording && (
              <TouchableOpacity
                className="w-14 h-14 rounded-full"
                style={{
                  backgroundColor: "red",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={handleStartRecording}
                disabled={isRecording || isTranscribing}
              >
                <FontAwesome name="microphone" size={30} color="white" />
              </TouchableOpacity>
            )}
            {isRecording && (
              <LottieView
                className="w-[56px] h-[56px]"
                source={gifs.recording}
                autoPlay
                loop
              />
            )}
            <TouchableOpacity
              className="w-14 h-14 rounded-full"
              style={{
                backgroundColor: "black",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={handleStopRecording}
              disabled={!isRecording || isTranscribing}
            >
              <FontAwesome name="stop" size={30} color="white" />
            </TouchableOpacity>
          </View>
          <View className="w-full space-y-5">
            {todoItems.map((item, index) => (
              <TodoCard
                key={item.name + item.weight + item.date + index}
                name={item.name}
                weight={item.weight}
                date={item.date}
              />
            ))}
          </View>
          <CustomButton
            title="Save Items"
            handlePress={submit}
            containerStyles="w-[50%] rounded-[50px] min-h-[55px] mt-4 bg-secondary-200"
            fontStyles="font-pmedium text-lg"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default create;
