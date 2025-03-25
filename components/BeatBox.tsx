
import { View } from 'react-native';
import { Color } from '../Colors';

interface BeatBoxProps {
    key: number,
    isActive: boolean,
    boxActiveColor: Color,
    boxInactiveColor: Color,
    sideLength: number,
}

export default function BeatBox(props: BeatBoxProps) {

    return(
        <View 
            key={props.key}
            style={{
                width: props.sideLength,
                aspectRatio: 1,
                backgroundColor: props.isActive ? props.boxActiveColor : props.boxInactiveColor,
            }}
        />
    );
}