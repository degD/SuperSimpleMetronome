import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function App() {
  const playIcon = <FontAwesome name="play" size={24} color="black" />
  const stopIcon = <FontAwesome name="pause" size={24} color="black" />

  const [bpm, onChangeBpm] = useState("100");
  const [beats, onChangeBeats] = useState("4");
  const [playing, setPlaying] = useState(false);
  const [buttonIcon, setButtonIcon] = useState(playIcon)

  return (
    <View style={styles.container}>
      <View id="beats" style={styles.section}><Text>aaaa</Text></View>

      <View id="beats-field" style={styles.section}>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <TextInput
            style={styles.input}
            onChangeText={onChangeBeats}
            value={beats}
            placeholder="useless placeholder"
            keyboardType="numeric"
          />
          <Text>Beats</Text>
        </View>
      </View>

      <View id="bpm-field" style={styles.section}>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <TextInput
            style={styles.input}
            onChangeText={onChangeBpm}
            value={bpm}
            placeholder="useless placeholder"
            keyboardType="numeric"
          />
          <Text>BPM</Text>
        </View>
      </View>

      <View id="button" style={styles.section}>
        <Pressable onPress={playStateChanged}>
          <View style={styles.button}>{buttonIcon}</View>
        </Pressable>
      </View>

      <StatusBar style='auto' />
    </View>
  );

  function playStateChanged() {
    setPlaying(!playing);
    if (playing) {
      setButtonIcon(playIcon);
    } else {
      setButtonIcon(stopIcon);
    }
    console.log("Pressed")
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#aaaaaa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    flex: 1,
    borderWidth: 4,
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    width: 120, 
    height: 120, 
    backgroundColor: "red", 
    justifyContent: "center", 
    alignItems: "center"
  }
});
