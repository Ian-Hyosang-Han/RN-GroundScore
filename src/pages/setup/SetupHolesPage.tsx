import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import StepContainer from '../../components/StepContainer';
import { useGameSetup } from '../../context/GameSetupContext';
import type { RootStackParamList } from '../../../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SetupHolesPage() {
  const navigation = useNavigation<NavigationProp>();
  const { setup, setHoles } = useGameSetup();

  return (
    <StepContainer>
      <Text
        className="mb-3 text-3xl"
        style={{ fontFamily: 'PlayfairDisplay-Bold', color: 'white' }}
      >
        How many holes?
      </Text>

      <View className="gap-4">
        {[9, 18].map(value => {
          const isSelected = setup.holes === value;

          return (
            <TouchableOpacity
              key={value}
              className={`flex-row items-center rounded-2xl border px-5 py-5 ${
                isSelected ? 'border-white bg-[#175E39]' : 'border-white/20 bg-white/10'
              }`}
              onPress={() => setHoles(value as 9 | 18)}
            >
              <View
                className={`mr-4 h-6 w-6 rounded-full border-2 ${
                  isSelected ? 'border-white bg-white' : 'border-white'
                }`}
              />
              <Text
                style={{ fontFamily: 'Montserrat-Bold', color: 'white', fontSize: 18 }}
              >
                {value} Holes
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        className="mt-8 rounded-2xl bg-[#175E39] px-5 py-4"
        onPress={() => navigation.navigate('SetupDate')}
      >
        <Text
          className="text-center"
          style={{ fontFamily: 'Montserrat-Bold', color: 'white', fontSize: 18 }}
        >
          Continue
        </Text>
      </TouchableOpacity>
    </StepContainer>
  );
}