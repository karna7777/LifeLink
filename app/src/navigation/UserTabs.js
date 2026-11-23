import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/user/HomeScreen';
import SearchScreen from '../screens/user/SearchScreen';
import FacilityDetailScreen from '../screens/user/FacilityDetailScreen';
import CreateRequestScreen from '../screens/user/CreateRequestScreen';
import MyRequestsScreen from '../screens/user/MyRequestsScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import NotificationsScreen from '../screens/shared/NotificationsScreen';
import RequestDetailScreen from '../screens/shared/RequestDetailScreen';
import { COLORS } from '../utils/constants';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Shared red header for all stacks.
const headerOptions = {
  headerStyle: { backgroundColor: COLORS.primary },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '700' },
};

// A simple emoji tab icon (keeps us within the stack — no icon library needed).
const tabIcon = (emoji) => () => <Text style={{ fontSize: 18 }}>{emoji}</Text>;

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'LifeLink' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Find supplies' }} />
      <Stack.Screen name="FacilityDetail" component={FacilityDetailScreen} options={{ title: 'Facility' }} />
      <Stack.Screen name="CreateRequest" component={CreateRequestScreen} options={{ title: 'New request' }} />
    </Stack.Navigator>
  );
}

function RequestsStack() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="MyRequests" component={MyRequestsScreen} options={{ title: 'My requests' }} />
      <Stack.Screen name="RequestDetail" component={RequestDetailScreen} options={{ title: 'Request' }} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'My profile' }} />
    </Stack.Navigator>
  );
}

// Bottom tabs for the normal user (patient / donor).
export default function UserTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: COLORS.primary }}>
      <Tab.Screen name="Home" component={HomeStack} options={{ tabBarIcon: tabIcon('🏠') }} />
      <Tab.Screen name="Search" component={SearchStack} options={{ tabBarIcon: tabIcon('🔍') }} />
      <Tab.Screen name="Requests" component={RequestsStack} options={{ tabBarIcon: tabIcon('📋') }} />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ tabBarIcon: tabIcon('👤') }} />
    </Tab.Navigator>
  );
}
