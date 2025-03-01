import { View, Text, Button } from "react-native";
import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { Audio } from "expo-av";
import { getSpeechToText } from "../../routes/product_api";

const Todo = () => {
  const { theme } = useSelector((state) => state.theme);
  const [recording, setRecording] = useState(null);
  const [transcription, setTranscription] = useState("");

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        alert("Permission to access microphone is required!");
        return;
      }

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      console.log("Recording started...");
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log("Recording saved to:", uri);
    setRecording(null);

    const text = await getSpeechToText(uri);
    setTranscription(text);
  };

  return (
    <SafeAreaView
      className={`${
        theme === "dark" ? "bg-primary-dark" : "bg-primary"
      } flex-1`}
    >
      <Navbar type={"todo"} />
      <Text>Todo</Text>
      <View>
        <Button
          title="Start Recording"
          onPress={startRecording}
          disabled={recording !== null}
        />
        <Button
          title="Stop Recording"
          onPress={stopRecording}
          disabled={recording === null}
        />
        <Text>Transcription: {transcription}</Text>
      </View>
    </SafeAreaView>
  );
};

export default Todo;
