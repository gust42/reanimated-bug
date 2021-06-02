import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';

const PASSIVE_OPACITY = 0.2;
const SELECT_ANIMATION_DELAY = 50;
const SELECT_ANIMATION_DURATION = 100;

export const Star = () => {
  const opacity = useSharedValue(PASSIVE_OPACITY);
  const scale = useSharedValue(1);
  const [isPressed, setIsPressed] = useState(false);

  const onStarPress = () => {
    if (!isPressed) {
      opacity.value = 1;
      scale.value = withDelay(
        SELECT_ANIMATION_DELAY,
        withSequence(
          withTiming(0.2, {
            duration: SELECT_ANIMATION_DURATION,
            easing: Easing.bezier(0.42, 0.0, 0.58, 1),
          }),
          withSpring(1, {stiffness: 300, damping: 15}),
        ),
      );
    } else {
      opacity.value = withTiming(PASSIVE_OPACITY, {
        duration: SELECT_ANIMATION_DURATION,
      });

      // Without this line the application crashes on multiple presses 
      // 'Cannot read property 'onFrame' of undefined' 
      scale.value = 1;
    }
    setIsPressed(!isPressed);
  };

  

  const animatedStyles = useAnimatedStyle(
    () => ({
      opacity: opacity.value,
      // If we comment out this transform opacity animation works correctly on web
      transform: [
        {
          scale: scale.value,
        },
      ],
    }),
  );


  return (
    <Animated.View style={[animatedStyles]}>
      <Pressable onPressIn={onStarPress}>
        <View style={{backgroundColor: '#ff0', width: 200, height: 200}} />
      </Pressable>
    </Animated.View>
  );
};
