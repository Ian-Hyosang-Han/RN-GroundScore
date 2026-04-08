import React from 'react';
import { ImageBackground, View } from 'react-native';

export default function StepContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ImageBackground
      source={require('../assets/bg-golf.jpg')}
      resizeMode="cover"
      className="flex-1"
    >
      <View className="flex-1 bg-black/35 px-6 pt-16 pb-8">
        {children}
      </View>
    </ImageBackground>
  );
}