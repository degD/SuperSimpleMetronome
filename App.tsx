import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function App() {
  const playIcon = <FontAwesome name="play" size={24} color="black" />
  const stopIcon = <FontAwesome name="pause" size={24} color="black" />

  const [bpm, setBpm] = useState("100");
  const [beats, setBeats] = useState("4");
  const [playing, setPlaying] = useState(false);
  const [buttonIcon, setButtonIcon] = useState(playIcon);
  const [beatContainerWidht, setBeatContainerWidth] = useState(0);
  const [boxes, setBoxes] = useState(generateBeatBoxes(4, 4));

  const [beatIndex, setBeatIndex] = useState(-1);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();
  const [begin, setBegin] = useState(false);

  useEffect(() => {
    // maybe load previous state from asyncstorage?
    const initialBeats = "4";
    setBeats(initialBeats);
    setBoxes( generateBeatBoxes(parseInt(initialBeats), -1) );
  }, []);

  useEffect(() => {
    if (playing) {
      stopPlaying();
      setBegin(true);
    }
    setBoxes( generateBeatBoxes(parseInt(beats), -1) );
    console.log("Update detected", bpm, beats, playing);
  }, [bpm, beats]);

  useEffect(() => {
    if (playing) {
      setBeatIndex(0);
    } 
    else {
      setBeatIndex(-1);
    }
  }, [playing]);

  useEffect(() => {
    if (begin) {
      setBegin(false);
      startPlaying();
    }
  }, [begin]);

  useEffect(() => {
    console.log("Beat index changed!", beatIndex);
    if (playing) {
      setBoxes( generateBeatBoxes(parseInt(beats), beatIndex) );
      let tid = setTimeout(() => {
        setBeatIndex( (beatIndex + 1) % parseInt(beats) );
      }, 60000 / (parseInt(bpm)+1));
      setTimeoutId(tid);
    }
  }, [beatIndex]);

  return (
    <View style={styles.container}>
      <View id="beats" style={styles.section}>
        <View 
          style={styles.beatBoxContainer} 
          onLayout={(event) => setBeatContainerWidth(event.nativeEvent.layout.width)}
        >
          {boxes}
        </View>
      </View>

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

  function generateBeatBoxes(n: number, boxIndex: number) {
    let boxes = [];
    let boxSize = beatContainerWidht / (n * 2);
    let maxSize = beatContainerWidht / 3;
    for (let i = 0; i < n; i++) {
      if (boxIndex != i) {
        boxes.push(<View key={i} style={[
          {width: boxSize, height: boxSize, maxWidth: maxSize, maxHeight: maxSize}, 
          styles.beatBox]}></View>);
      }
      else {
        boxes.push(<View key={i} style={[
          {width: boxSize, height: boxSize, maxWidth: maxSize, maxHeight: maxSize}, 
          styles.beatBox, {backgroundColor: "red"}]}></View>);
      }
    }
    return boxes;
  }

  function startPlaying() {
    setPlaying(true);
    setBeatIndex(0);
  }

  function stopPlaying() {
    setPlaying(false);
    clearTimeout(timeoutId);
    setBeatIndex(-1);
  }

  function playStateChanged() {
    setPlaying(!playing);
    if (!playing) {
      setButtonIcon(stopIcon);
    } else {
      setButtonIcon(playIcon);
    }
  }

  function onChangeBeats(beats: string) {
    let beatBoxesArray = [];
    let beatsNr = parseInt(beats);
    for (let i = 0; i < beatsNr; i++) {
      beatBoxesArray.push(<View key={i} style={styles.beatBox}></View>)
    }
    setBeats(beats)
  }

  function onChangeBpm(bpm: string) {
    setBpm(bpm);
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
    alignItems: "center",
    borderRadius: "100%"
  },
  beatBox: {
    backgroundColor: "green",
    borderRadius: "100%",
  },
  beatBoxContainer: {
    flexDirection: "row", 
    justifyContent: "space-around", 
    width: "80%",
    flexWrap: "wrap"
  }
});
