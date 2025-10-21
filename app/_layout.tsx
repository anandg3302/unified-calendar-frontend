// These imports must be first to initialize gesture handler and reanimated correctly
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="(auth)/register" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen 
            name="event-details" 
            options={{ 
              headerShown: true, 
              title: 'Event Details',
              presentation: 'modal'
            }} 
          />
          <Stack.Screen 
            name="create-event" 
            options={{ 
              headerShown: true, 
              title: 'Create Event',
              presentation: 'modal'
            }} 
          />
          <Stack.Screen 
            name="edit-event" 
            options={{ 
              headerShown: true, 
              title: 'Edit Event',
              presentation: 'modal'
            }} 
          />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}