import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import { REACT_NATIVE_APP_SERVER_DOMAIN } from "@env";

const baseURL = REACT_NATIVE_APP_SERVER_DOMAIN;

export const transcribeSpeech = async (recordingUri) => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: false,
    });

    if (!recordingUri) {
      console.error("No recording URI found!");
      return undefined;
    }

    let base64Uri = "";
    if (Platform.OS === "web") {
      const response = await fetch(recordingUri);
      const blob = await response.blob();
      base64Uri = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split("base64,")[1]);
        reader.readAsDataURL(blob);
      });
    } else {
      base64Uri = await FileSystem.readAsStringAsync(recordingUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    }

    const response = await fetch(`${baseURL}/product/speech-to-text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        audioUrl: base64Uri,
        format: "wav",
      }),
    });

    const result = await response.json();

    return result?.text || "";
  } catch (error) {
    console.error("Failed to transcribe speech!", error);
    return undefined;
  }
};
