
import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Color } from '../Colors';
import BeatBox from './BeatBox';

interface BeatBoxContainerProps {
    boxNumber: number,
    boxIndex: number,
    boxActiveColor: Color,
    boxInactiveColor: Color
}

export default function BeatBoxContainer(props: BeatBoxContainerProps) {

    const [boxes, setBoxes] = useState<React.JSX.Element[]>([]);

    useEffect(() => {
        const tempBoxesList = [];
        for (let i = 0; i < props.boxNumber; i++) {
            tempBoxesList.push(
                <BeatBox 
                    key={i} 
                    isActive={i == props.boxIndex}
                    boxActiveColor={props.boxActiveColor}
                    boxInactiveColor={props.boxInactiveColor}
                    sideLength={20}
                />
            );
        }
        setBoxes(tempBoxesList);
    }, [props.boxNumber, props.boxIndex, props.boxActiveColor, props.boxInactiveColor]);

    return(
        <View>{boxes}</View>
    );
}

const styles = StyleSheet.create({
    beatBox: {
        borderRadius: 20,
    },
        beatBoxContainer: {
        flexDirection: "row", 
        justifyContent: "space-around", 
        width: "80%",
        flexWrap: "wrap",
    },
});