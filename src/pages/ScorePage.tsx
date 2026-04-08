import React from 'react';
import { Text, View } from 'react-native';

export default function ScorePage() {
  return (
    <View className="flex-1 items-center justify-center bg-neutral-900 px-6">
      <Text className="mb-3 text-4xl font-bold text-white">Score</Text>
      <Text className="text-base text-white/80">
        This is where score records will go.
      </Text>
    </View>
  );
}