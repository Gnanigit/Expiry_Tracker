import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Navbar from "../../components/Navbar";
import { Audio } from "expo-av";
import { transcribeSpeech } from "../../utils/transcribeSpeech";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import useWebFocus from "../../hooks/useWebFocus";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import TodoCard from "../../components/TodoCard";

const Todo = () => {
  const { theme } = useSelector((state) => state.theme);
  const [transcribedSpeech, setTranscribedSpeech] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [todoItems, setTodoItems] = useState([]);
  const isWebFocused = useWebFocus();
  const audioRecordingRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioRecordingRef.current && isRecording) {
        audioRecordingRef.current.stopAndUnloadAsync().catch(console.error);
      }
    };
  }, []);

  const parseTodoItems = (text) => {
    const items = text.split(" add. ").filter(Boolean);
    return items.map((item) => {
      const parts = item.split(" ");
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

  return (
    <SafeAreaView
      className={`${
        theme === "dark" ? "bg-primary-dark" : "bg-primary"
      } h-full`}
    >
      <Navbar type={"todo"} />
      <ScrollView style={styles.mainScrollContainer}>
        <View style={styles.mainInnerContainer}>
          <Text style={styles.title}>Welcome to the Speech-to-Text App</Text>
          <View style={styles.transcriptionContainer}>
            {isTranscribing ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text style={styles.transcribedText}>
                {transcribedSpeech ||
                  "Your transcribed text will be shown here"}
              </Text>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.microphoneButton, isRecording && styles.recording]}
              onPress={startRecording}
              disabled={isRecording || isTranscribing}
            >
              <FontAwesome name="microphone" size={40} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.stopButton, !isRecording && styles.disabled]}
              onPress={stopRecording}
              disabled={!isRecording || isTranscribing}
            >
              <FontAwesome name="stop" size={40} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.todoContainer}>
            {todoItems.map((item, index) => (
              <TodoCard
                key={index}
                name={item.name}
                weight={item.weight}
                date={item.date}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainScrollContainer: {
    paddingBottom: 100,
    height: "100%",
    width: "100%",
    marginBottom: 50,
  },
  mainInnerContainer: {
    gap: 75,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  title: {
    fontSize: 35,
    padding: 5,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  transcriptionContainer: {
    backgroundColor: "rgb(220,220,220)",
    width: "100%",
    height: 300,
    padding: 20,

    borderRadius: 5,
  },
  transcribedText: {
    fontSize: 20,
    padding: 5,
    color: "#000",
    textAlign: "left",
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 20,
  },
  todoContainer: {
    width: "100%",
    marginTop: 20,
  },
  microphoneButton: {
    backgroundColor: "red",
    width: 75,
    height: 75,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  stopButton: {
    backgroundColor: "black",
    width: 75,
    height: 75,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  recording: {
    backgroundColor: "darkred",
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Todo;
