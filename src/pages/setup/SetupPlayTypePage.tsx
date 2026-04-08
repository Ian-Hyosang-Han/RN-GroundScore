import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import StepContainer from '../../components/StepContainer';
import { useGameSetup } from '../../context/GameSetupContext';
import type { RootStackParamList } from '../../../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SetupPlayTypePage() {
  const navigation = useNavigation<NavigationProp>();
  const { setPlayType } = useGameSetup();

  const selectType = (type: 'solo' | 'group') => {
    setPlayType(type);
    navigation.navigate('SetupCourse');
  };

  return (
    <StepContainer>
      <Text
        className="mt-10 mb-3 text-3xl"
        style={{ fontFamily: 'PlayfairDisplay-Bold', color: 'white' }}
      >
        How are you playing today?
      </Text>

      <Text
        className="mb-8 text-base"
        style={{ fontFamily: 'Inter_18pt-Regular', color: 'white' }}
      >
        Choose solo or group play first.
      </Text>

      <View className="gap-4">
        <TouchableOpacity
          className="rounded-2xl border border-white/30 bg-white/15 px-5 py-5"
          onPress={() => selectType('solo')}
        >
          <Text
            style={{ fontFamily: 'Montserrat-Bold', color: 'white', fontSize: 18 }}
          >
            Solo Play
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="rounded-2xl border border-white/30 bg-white/15 px-5 py-5"
          onPress={() => selectType('group')}
        >
          <Text
            style={{ fontFamily: 'Montserrat-Bold', color: 'white', fontSize: 18 }}
          >
            Group Play
          </Text>
        </TouchableOpacity>
      </View>
    </StepContainer>
  );
}