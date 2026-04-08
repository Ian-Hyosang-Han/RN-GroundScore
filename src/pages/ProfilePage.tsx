import React from 'react';
import { Text, View } from 'react-native';

export default function ProfilePage() {
  return (
    <View className="flex-1 items-center justify-center bg-black px-6">
      <Text className="mb-3 text-4xl font-bold text-white">Profile</Text>
      <Text className="text-base text-white/80">
        User profile and settings
      </Text>
    </View>
  );
}