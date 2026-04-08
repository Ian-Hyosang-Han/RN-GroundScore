import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import StepContainer from '../../components/StepContainer';
import { useGameSetup } from '../../context/GameSetupContext';
import type { RootStackParamList } from '../../../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SetupCoursePage() {
  const navigation = useNavigation<NavigationProp>();
  const { setup, setCourseName } = useGameSetup();
  const [course, setCourse] = useState(setup.courseName);

  const next = () => {
    if (!course.trim()) {
      return;
    }

    setCourseName(course.trim());

    if (setup.playType === 'group') {
      navigation.navigate('SetupPlayers');
      return;
    }

    navigation.navigate('SetupHoles');
  };

  return (
    <StepContainer>
      <Text
        className="mt-10 mb-10 text-3xl"
        style={{ fontFamily: 'PlayfairDisplay-Bold', color: 'white' }}
      >
        What course are you playing?
      </Text>

      <TextInput
        value={course}
        onChangeText={setCourse}
        placeholder="Enter golf course name"
        placeholderTextColor="rgba(255,255,255,0.6)"
        className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-white"
      />

      <TouchableOpacity
        className="mt-6 rounded-2xl bg-[#175E39] px-5 py-4"
        onPress={next}
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