import { Text, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DashboardScreen from '../screens/staff/DashboardScreen';
import InventoryScreen from '../screens/staff/InventoryScreen';
import AddEditItemScreen from '../screens/staff/AddEditItemScreen';
import IncomingRequestsScreen from '../screens/staff/IncomingRequestsScreen';
import BroadcastScreen from '../screens/staff/BroadcastScreen';
import FacilitySetupScreen from '../screens/staff/FacilitySetupScreen';
import RequestDetailScreen from '../screens/shared/RequestDetailScreen';
import NotificationsScreen from '../screens/shared/NotificationsScreen';
import { COLORS } from '../utils/constants';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const headerOptions = {
  headerStyle: { backgroundColor: COLORS.primary },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '700' },
};

const tabIcon = (emoji) => () => <Text style={{ fontSize: 18 }}>{emoji}</Text>;

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
              <Text style={{ fontSize: 18 }}>🔔</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}

function InventoryStack() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="Inventory" component={InventoryScreen} />
      <Stack.Screen name="AddEditItem" component={AddEditItemScreen} options={{ title: 'Item' }} />
    </Stack.Navigator>
  );
}

function RequestsStack() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="IncomingRequests" component={IncomingRequestsScreen} options={{ title: 'Requests' }} />
      <Stack.Screen name="RequestDetail" component={RequestDetailScreen} options={{ title: 'Request' }} />
    </Stack.Navigator>
  );
}

function BroadcastStack() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="Broadcast" component={BroadcastScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="FacilitySetup" component={FacilitySetupScreen} options={{ title: 'My facility' }} />
    </Stack.Navigator>
  );
}

// Bottom tabs for facility staff.
export default function StaffTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: COLORS.primary }}>
      <Tab.Screen name="DashboardTab" component={DashboardStack} options={{ title: 'Dashboard', tabBarIcon: tabIcon('📊') }} />
      <Tab.Screen name="InventoryTab" component={InventoryStack} options={{ title: 'Inventory', tabBarIcon: tabIcon('📦') }} />
      <Tab.Screen name="RequestsTab" component={RequestsStack} options={{ title: 'Requests', tabBarIcon: tabIcon('📋') }} />
      <Tab.Screen name="BroadcastTab" component={BroadcastStack} options={{ title: 'Broadcast', tabBarIcon: tabIcon('📢') }} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: 'Profile', tabBarIcon: tabIcon('🏥') }} />
    </Tab.Navigator>
  );
}
