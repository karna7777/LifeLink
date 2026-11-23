import { Text, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FacilitiesListScreen from '../screens/admin/FacilitiesListScreen';
import AdminStatsScreen from '../screens/admin/AdminStatsScreen';
import { COLORS } from '../utils/constants';

const Stack = createNativeStackNavigator();

// Admin screens: verify facilities, and view platform stats.
export default function AdminStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen
        name="FacilitiesList"
        component={FacilitiesListScreen}
        options={({ navigation }) => ({
          title: 'Facilities',
          // Quick link to the stats screen from the header.
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('AdminStats')}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Stats</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen name="AdminStats" component={AdminStatsScreen} options={{ title: 'Stats' }} />
    </Stack.Navigator>
  );
}
