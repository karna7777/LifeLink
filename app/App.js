import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { SocketProvider } from './src/context/SocketContext';
import { NetworkProvider, useNetwork } from './src/context/NetworkContext';
import OfflineBanner from './src/components/OfflineBanner';
import RootNavigator from './src/navigation/RootNavigator';

// Shows the offline banner above the whole app.
function Shell() {
  const { online } = useNetwork();
  return (
    <View style={{ flex: 1 }}>
      <OfflineBanner visible={!online} />
      <NavigationContainer>
        <StatusBar style="light" />
        <RootNavigator />
      </NavigationContainer>
    </View>
  );
}

// App entry point: auth + socket + network + navigation providers.
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SocketProvider>
          <NetworkProvider>
            <Shell />
          </NetworkProvider>
        </SocketProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
