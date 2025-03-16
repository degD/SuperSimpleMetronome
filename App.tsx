import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const backColor = "#222831";
const deactiveColor = "#393E46";
const activeColor = "#00ADB5";
const textColor = "#EEEEEE";

export default function App() {
  const playIcon = <FontAwesome name="play" size={60} color="black" />
  const stopIcon = <FontAwesome name="pause" size={60} color="black" />

  const [bpm, setBpm] = useState("100");
  const [beats, setBeats] = useState("4");
  const [playing, setPlaying] = useState(false);
  const [buttonIcon, setButtonIcon] = useState(playIcon);
  const [beatContainerWidht, setBeatContainerWidth] = useState(0);
  const [boxes, setBoxes] = useState(() => generateBeatBoxes(4, 4));
  const [buttonColor, setButtonColor] = useState(activeColor);

  const [beatIndex, setBeatIndex] = useState(-1);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();
  const [begin, setBegin] = useState(false);

  const [bpmBorder, setBpmBorder] = useState(activeColor);
  const [beatsBorder, setBeatsBorder] = useState(activeColor);

  const [sound1, setSound1] = useState<Audio.Sound>();
  const [sound2, setSound2] = useState<Audio.Sound>();

  useEffect(() => {
    Audio.Sound.createAsync( require('./metronome1.mp3') )
      .then(data => setSound1(data.sound));
    Audio.Sound.createAsync( require('./metronome2.mp3') )
      .then(data => setSound2(data.sound));
    console.log("Sounds loaded!");
  }, []);

  useEffect(() => {
    if (playing) {
      stopPlaying();
      setBegin(true);
    }
    if (validateInputs())
      setBoxes( generateBeatBoxes(parseInt(beats), -1) );
    console.log("Update detected", bpm, beats, playing, "\n", boxes);
  }, [bpm, beats]);

  useEffect(() => {
    if (playing) {
      startPlaying();
    } 
    else {
      stopPlaying();
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
    if (validateInputs()) {
      if (playing) {
        setBoxes( generateBeatBoxes(parseInt(beats), beatIndex) );
        let tid = setTimeout(() => {
          setBeatIndex( (beatIndex + 1) % parseInt(beats) );
        }, 60000 / (parseInt(bpm)+1));
        setTimeoutId(tid);
      }
    }
  }, [beatIndex]);

  useEffect(() => {
    return sound1
      ? () => {
          console.log('Unloading Sound1');
          sound1.unloadAsync();
        }
      : undefined;
  }, [sound1]);

  useEffect(() => {
    return sound2
      ? () => {
          console.log('Unloading Sound2');
          sound2.unloadAsync();
        }
      : undefined;
  }, [sound2]);

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
            style={[styles.input, {borderColor: beatsBorder}]}
            onChangeText={onChangeBeats}
            value={beats}
            keyboardType="numeric"
          />
          <Text style={styles.text}>Beats</Text>
        </View>
      </View>

      <View id="bpm-field" style={styles.section}>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <TextInput
            style={[styles.input, {borderColor: bpmBorder}]}
            onChangeText={onChangeBpm}
            value={bpm}
            keyboardType="numeric"
          />
          <Text style={styles.text}>BPM</Text>
        </View>
      </View>

      <View id="button" style={styles.section}>
        <Pressable onPress={playStateChanged}>
          <View style={[styles.button, {backgroundColor: buttonColor}]}>{buttonIcon}</View>
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
          styles.beatBox, {backgroundColor: activeColor}]}></View>);
        if (playing) {
          i == 0 ? playSound1() : playSound2();
        }
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
      setButtonColor(deactiveColor);
    } else {
      setButtonIcon(playIcon);
      setButtonColor(activeColor);
    }
  }

  function onChangeBeats(beats: string) {
    let beatBoxesArray = [];
    let beatsNr = parseInt(beats);
    for (let i = 0; i < beatsNr; i++) {
      beatBoxesArray.push(<View key={i} style={styles.beatBox}></View>)
    }
    setBeats(beats);

  }

  function onChangeBpm(bpm: string) {
    setBpm(bpm);

  }

  function isInt(str: string) {
    str = str.trim();
    if (!str) {
      return false;
    }
    str = str.replace(/^0+/, "") || "0";
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
  }

  function validateInputs() {
    if (isInt(beats)) {
      setBeatsBorder(activeColor);
    }
    else {
      setBeatsBorder(deactiveColor);
    }
    if (isInt(bpm)) {
      setBpmBorder(activeColor);
    }
    else {
      setBpmBorder(deactiveColor);
    }

    return (isInt(beats) && isInt(bpm));
  }

  // https://freesound.org/s/250552/
  async function playSound1() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync( require('./metronome1.mp3')
    );
    setSound1(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  // https://freesound.org/s/548518/
  async function playSound2() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync( require('./metronome2.mp3')
    );
    setSound2(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    flex: 1,
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    minWidth: 80,
    margin: 12,
    borderWidth: 4,
    borderRadius: 10,
    padding: 10,
    borderColor: activeColor,
    color: textColor,
    fontSize: 60, 
    textAlign: "center"
  },
  button: {
    width: 200, 
    height: 200, 
    backgroundColor: activeColor, 
    justifyContent: "center", 
    alignItems: "center",
    borderRadius: "10%"
  },
  beatBox: {
    backgroundColor: deactiveColor,
    borderRadius: "10%",
  },
  beatBoxContainer: {
    flexDirection: "row", 
    justifyContent: "space-around", 
    width: "80%",
    flexWrap: "wrap",
    marginTop: 60
  },
  text: {
    color: textColor,
    fontSize: 60
  }
});
