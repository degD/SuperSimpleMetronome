import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, TextInput, Appearance, useColorScheme } from 'react-native';
import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import themeColors from './Colors';

export default function App() {
  const playIcon = <FontAwesome name="play" size={60} color="black" />
  const stopIcon = <FontAwesome name="pause" size={60} color="black" />

  // Update colors for the initial system theme.
  let colorScheme = useColorScheme();     // TODO: Why not changing dynamically
  const [backColor, setBackColor] = useState(themeColors.light.backColor);
  const [activeColor, setActiveColor] = useState(themeColors.light.activeColor);
  const [deactiveColor, setDeactiveColor] = useState(themeColors.light.deactiveColor);
  const [textColor, setTextColor] = useState(themeColors.light.textColor);

  useEffect(() => {
    if (colorScheme) {
      setBackColor( themeColors[colorScheme].backColor );
      setActiveColor( themeColors[colorScheme].activeColor );
      setDeactiveColor( themeColors[colorScheme].deactiveColor );
      setTextColor( themeColors[colorScheme].textColor );
      console.log("Colors set!", colorScheme);
    }
  }, []);
  // Appearance.addChangeListener(() => {
  //   let colorScheme = Appearance.getColorScheme();
  //   backColor = themeColors[colorScheme].backColor;
  //   activeColor = themeColors[colorScheme].activeColor;
  //   deactiveColor = themeColors[colorScheme].deactiveColor;
  //   textColor = themeColors[colorScheme].textColor;
  //   console.log("Colors set!", colorScheme);
  // });

  // Main application variables.
  const [bpm, setBpm] = useState("100");
  const [beats, setBeats] = useState("4");
  const [playing, setPlaying] = useState(false);
  const [buttonIcon, setButtonIcon] = useState(playIcon);
  const [beatContainerWidht, setBeatContainerWidth] = useState(0);
  const [boxes, setBoxes] = useState(() => generateBeatBoxes(4, 4));
  const [buttonColor, setButtonColor] = useState(activeColor);

  // Variables that are responsible of beating/playing.
  const [beatIndex, setBeatIndex] = useState(-1);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();
  const [begin, setBegin] = useState(false);

  // Variables about input validation.
  const [bpmBorder, setBpmBorder] = useState(activeColor);
  const [beatsBorder, setBeatsBorder] = useState(activeColor);

  // Sound objects.
  const [sound1, setSound1] = useState<Audio.Sound>();
  const [sound2, setSound2] = useState<Audio.Sound>();

  // When bpm or beats input field modified, first validate the inputs
  // before regenerating the beat boxes. If inputs are incorrect, stop
  // beating. 
  useEffect(() => {
    if (playing) {
      stopPlaying();
      setBegin(true);
    }
    if (validateInputs())
      setBoxes( generateBeatBoxes(parseInt(beats), -1) );
    console.log("Update detected", bpm, beats, playing, "\n", boxes);
  }, [bpm, beats]);

  // Start/stop setups after pressing the button.
  useEffect(() => {
    if (playing) {
      startPlaying();
    } 
    else {
      stopPlaying();
    }
  }, [playing]);

  // The 'begin' is used because the state modifications are not applied
  // immediately in a function block. In this case, a jump to the 'begin'
  // block is necessary after the 'stopPlaying' setup function. 
  // Basically, the playing is stopped and restarted to prevent the
  // usual confusion.
  useEffect(() => {
    if (begin) {
      setBegin(false);
      startPlaying();
    }
  }, [begin]);

  // To make the beatings with an interval. The core of the metronome-ing.
  useEffect(() => {
    console.log("Beat index changed!", beatIndex);
    if (validateInputs()) {
      if (playing) {
        setBoxes( generateBeatBoxes(parseInt(beats), beatIndex) );
        let tid = setTimeout(() => {
          setBeatIndex( (beatIndex + 1) % parseInt(beats) );
        }, 60000 / parseInt(bpm));  // The timing part
        setTimeoutId(tid);
      }
    }
  }, [beatIndex]);

  // Constant unloading of the sound is necessary to prevent
  // the sound from stopping after a while.
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
    <View style={[styles.container, {backgroundColor: backColor}]}>
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
            style={[styles.input, {borderColor: activeColor, color: textColor}, {borderColor: beatsBorder}]}
            onChangeText={onChangeBeats}
            value={beats}
            keyboardType="numeric"
          />
          <Text style={[styles.text, {color: textColor}]}>Beats</Text>
        </View>
      </View>

      <View id="bpm-field" style={styles.section}>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <TextInput
            style={[styles.input, {borderColor: activeColor, color: textColor}, {borderColor: bpmBorder}]}
            onChangeText={setBpm}
            value={bpm}
            keyboardType="numeric"
          />
          <Text style={[styles.text, {color: textColor}]}>BPM</Text>
        </View>
      </View>

      <View id="button" style={styles.section}>
        <Pressable onPress={playStateChanged}>
          <View style={[styles.button, {backgroundColor: activeColor}, {backgroundColor: buttonColor}]}>{buttonIcon}</View>
        </Pressable>
      </View>

      <StatusBar style='auto' />
    </View>
  );

  /**
   * Generate beat boxes dynamically with beating effect and sound.
   * @param n Number of boxes
   * @param boxIndex Index of the 'beating' box
   * @returns list of box View components
   */
  function generateBeatBoxes(n: number, boxIndex: number) {
    let boxes = [];
    let boxSize = beatContainerWidht / (n * 2);
    let maxSize = beatContainerWidht / 3;
    for (let i = 0; i < n; i++) {
      if (boxIndex != i) {
        boxes.push(<View key={i} style={[
          {width: boxSize, height: boxSize, maxWidth: maxSize, maxHeight: maxSize}, 
          styles.beatBox, {backgroundColor: deactiveColor}]}></View>);
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

  /**
   * Setup to start beating.
   */
  function startPlaying() {
    setPlaying(true);
    setBeatIndex(0);
  }

  /**
   * Setup to reset beating.
   */
  function stopPlaying() {
    setPlaying(false);
    clearTimeout(timeoutId);
    setBeatIndex(-1);
  }

  /**
   * The function that get called when the play/stop button has pressed.
   * Basically stops/resets or starts the beating of the metronome.
   */
  function playStateChanged() {
    setPlaying(!playing);   
    if (!playing) {   // Actually called when 'playing == true' but states do not update inside.
      setButtonIcon(stopIcon);
      setButtonColor(deactiveColor);
    } else {
      setButtonIcon(playIcon);
      setButtonColor(activeColor);
    }
  }

  /**
   * Generate beat boxes by the value. Used at 'beats' input field.
   * @param beats New number of beats as a string
   */
  function onChangeBeats(beats: string) {
    let beatBoxesArray = [];
    let beatsNr = parseInt(beats);
    for (let i = 0; i < beatsNr; i++) {
      beatBoxesArray.push(<View key={i} style={styles.beatBox}></View>)
    }
    setBeats(beats);

  }

  /**
   * Return true if the given string is an integer without trailing or following
   * whitespaces. Return false otherwise.
   * @param str Potentially integer numeric string
   * @returns true if integer with no spaces, false otherwise
   */
  function isInt(str: string) {
    str = str.trim();
    if (!str) {
      return false;
    }
    str = str.replace(/^0+/, "") || "0";
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
  }

  /**
   * Check the values written into input fields. Modify input field border
   * colors according to it. For example, deactive the field when the input
   * is not an integer (or in the correct form). Then return true if both 
   * fields are correct. Return false otherwise.
   * @returns true or false
   */
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

  /**
   * This sound is used at the first beat.
   */
  async function playSound1() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync( require('./metronome1.mp3')
    // https://freesound.org/s/250552/
    );
    setSound1(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  /**
   * This sound is used at the beats following the first one.
   */
  async function playSound2() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync( require('./metronome2.mp3')
    // https://freesound.org/s/548518/
    );
    setSound2(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 60, 
    textAlign: "center"
  },
  button: {
    width: 200, 
    height: 200,
    justifyContent: "center", 
    alignItems: "center",
    borderRadius: "10%"
  },
  beatBox: {
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
    fontSize: 60
  }
});
