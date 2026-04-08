import './global.css';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './src/navigation/TabNavigator';
import ScoreCardPage from './src/pages/ScoreCardPage';

import SetupPlayTypePage from './src/pages/setup/SetupPlayTypePage';
import SetupCoursePage from './src/pages/setup/SetupCoursePage';
import SetupPlayersPage from './src/pages/setup/SetupPlayersPage';
import SetupHolesPage from './src/pages/setup/SetupHolesPage';
import SetupDatePage from './src/pages/setup/SetupDatePage';

import { GameSetupProvider } from './src/context/GameSetupContext';

export type RootStackParamList = {
  MainTabs: undefined;
  SetupPlayType: undefined;
  SetupCourse: undefined;
  SetupPlayers: undefined;
  SetupHoles: undefined;
  SetupDate: undefined;
  ScoreCardPage: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GameSetupProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="SetupPlayType" component={SetupPlayTypePage} />
          <Stack.Screen name="SetupCourse" component={SetupCoursePage} />
          <Stack.Screen name="SetupPlayers" component={SetupPlayersPage} />
          <Stack.Screen name="SetupHoles" component={SetupHolesPage} />
          <Stack.Screen name="SetupDate" component={SetupDatePage} />
          <Stack.Screen name="ScoreCardPage" component={ScoreCardPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </GameSetupProvider>
  );
}