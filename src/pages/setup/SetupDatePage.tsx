import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import StepContainer from '../../components/StepContainer';
import { useGameSetup } from '../../context/GameSetupContext';
import type { RootStackParamList } from '../../../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SetupDatePage() {
  const navigation = useNavigation<NavigationProp>();
  const { setup, setGameDate, initializeScoreCard } = useGameSetup();
  const [date, setDate] = useState(setup.gameDate);

  const finish = () => {
    setGameDate(date);
    initializeScoreCard();
    navigation.navigate('ScoreCardPage');
  };

  return (
    <StepContainer>
      <Text
        className="mb-3 text-3xl"
        style={{ fontFamily: 'PlayfairDisplay-Bold', color: 'white' }}
      >
        Game Date
      </Text>

      <TextInput
        value={date}
        onChangeText={setDate}
        placeholder="YYYY-MM-DD"
        placeholderTextColor="rgba(255,255,255,0.6)"
        className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-white"
      />

      <TouchableOpacity
        className="mt-8 rounded-2xl bg-[#175E39] px-5 py-4"
        onPress={finish}
      >
        <Text
          className="text-center"
          style={{ fontFamily: 'Montserrat-Bold', color: 'white', fontSize: 18 }}
        >
          Create Score Card
        </Text>
      </TouchableOpacity>
    </StepContainer>
  );
}