import React from 'react';
import { ImageBackground, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomePage() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ImageBackground
      source={require('../assets/bg-golf.jpg')}
      resizeMode="cover"
      className="flex-1"
    >
      <View className="flex-1 justify-center bg-black/25 px-10">
        <Text
          className="mb-3 text-center text-4xl"
          style={{ fontFamily: 'PlayfairDisplay-Bold', color: 'white' }}
        >
          GroundScore
        </Text>

        <Text
          className="mb-10 text-center text-lg"
          style={{ fontFamily: 'Inter_18pt-Regular', color: 'white' }}
        >
          Where are you teeing off today?
        </Text>

        <TouchableOpacity
          className="rounded-2xl border border-white/30 bg-white/15 px-6 py-5"
          onPress={() => navigation.navigate('SetupPlayType')}
        >
          <Text
            className="text-center text-lg"
            style={{ fontFamily: 'Montserrat-Bold', color: 'white' }}
          >
            Start Your Round
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}