import React, { useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import StepContainer from '../../components/StepContainer';
import { useGameSetup } from '../../context/GameSetupContext';
import type { RootStackParamList } from '../../../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SetupPlayersPage() {
  const navigation = useNavigation<NavigationProp>();
  const { setup, addPlayer, removePlayer } = useGameSetup();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [playerName, setPlayerName] = useState('');

  const openModal = () => {
    setPlayerName('');
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setPlayerName('');
  };

  const onAddPlayer = () => {
    if (!playerName.trim()) {
      return;
    }

    addPlayer(playerName.trim());
    closeModal();
  };

  return (
    <>
      <StepContainer>
        <Text
          className="mb-3 text-3xl"
          style={{ fontFamily: 'PlayfairDisplay-Bold', color: 'white' }}
        >
          Add your players
        </Text>

        <Text
          className="mb-6 text-base"
          style={{ fontFamily: 'Inter_18pt-Regular', color: 'white' }}
        >
          Add group members before you start the round.
        </Text>

        <TouchableOpacity
          className="mb-6 rounded-2xl border border-white/20 bg-white/15 px-5 py-4"
          onPress={openModal}
        >
          <Text
            className="text-center"
            style={{
              fontFamily: 'Montserrat-Bold',
              color: 'white',
              fontSize: 18,
            }}
          >
            + Add Player
          </Text>
        </TouchableOpacity>

        <View className="gap-3">
          {setup.players.map(player => (
            <View
              key={player.id}
              className="flex-row items-center justify-between rounded-2xl border border-white/20 bg-white/10 px-4 py-4"
            >
              <Text
                style={{
                  fontFamily: 'Inter_18pt-Regular',
                  color: 'white',
                  fontSize: 16,
                }}
              >
                {player.name}
              </Text>

              <TouchableOpacity onPress={() => removePlayer(player.id)}>
                <Text style={{ color: '#ffb3b3' }}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          className="mt-8 rounded-2xl bg-[#175E39] px-5 py-4"
          onPress={() => navigation.navigate('SetupHoles')}
        >
          <Text
            className="text-center"
            style={{
              fontFamily: 'Montserrat-Bold',
              color: 'white',
              fontSize: 18,
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </StepContainer>

      <Modal visible={isModalVisible} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full rounded-2xl bg-white p-6">
            <Text className="mb-4 text-lg font-bold text-black">Add Member</Text>

            <TextInput
              value={playerName}
              onChangeText={setPlayerName}
              placeholder="Enter member name"
              placeholderTextColor="#999"
              autoFocus
              style={{
                borderWidth: 1,
                borderColor: '#d4d4d4',
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                color: '#000',
                backgroundColor: '#fff',
              }}
            />

            <View className="mt-5 flex-row justify-end gap-3">
              <TouchableOpacity
                className="rounded-xl bg-neutral-300 px-4 py-3"
                onPress={closeModal}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="rounded-xl bg-[#175E39] px-4 py-3"
                onPress={onAddPlayer}
              >
                <Text className="text-white">Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}