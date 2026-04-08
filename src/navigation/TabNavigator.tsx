import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../pages/HomePage';
import ScorePage from '../pages/ScorePage';
import ProfilePage from '../pages/ProfilePage';
import LucideIcon from '@react-native-vector-icons/lucide';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 70,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },

        tabBarIconStyle: {
          marginTop: 8,
        },

        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#8a8a8a',

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 8,
        },

        tabBarIcon: ({ color, size }) => {

          if (route.name === 'Home') {
            return <LucideIcon name="house" size={size} color={color} />;
          }

          if (route.name === 'Score') {
            return <LucideIcon name="book-text" size={size} color={color} />;
          }

          if (route.name === 'Profile') {
            return <LucideIcon name="square-user-round" size={size} color={color} />;
          }

          return null;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Score" component={ScorePage} />
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  );
}