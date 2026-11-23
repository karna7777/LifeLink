import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import { COLORS } from '../utils/constants';

const Stack = createNativeStackNavigator();

// Screens shown when nobody is logged in.
export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: '#fff' }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
    </Stack.Navigator>
  );
}
