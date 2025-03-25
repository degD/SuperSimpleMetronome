
import { View } from 'react-native';
import { Color } from '../Colors';

interface BeatBoxProps {
    isActive: boolean,
    boxActiveColor: Color,
    boxInactiveColor: Color,
}

export default function BeatBox(props: BeatBoxProps) {

    return(
        <View 
            style={{
                flex: 1,
                aspectRatio: 1,
                marginHorizontal: 10,
                backgroundColor: props.isActive ? props.boxActiveColor : props.boxInactiveColor,
            }}
        />
    );
}