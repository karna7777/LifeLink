import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import AuthStack from './AuthStack';
import UserTabs from './UserTabs';
import StaffTabs from './StaffTabs';
import AdminStack from './AdminStack';
import FacilitySetupScreen from '../screens/staff/FacilitySetupScreen';
import { COLORS } from '../utils/constants';

const SetupStack = createNativeStackNavigator();

// Staff who haven't created their facility yet must do that before anything else.
function StaffSetupStack() {
  return (
    <SetupStack.Navigator
      screenOptions={{ headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: '700' } }}
    >
      <SetupStack.Screen name="FacilitySetup" component={FacilitySetupScreen} options={{ title: 'Set up your facility' }} />
    </SetupStack.Navigator>
  );
}

// Decides which part of the app to show based on the logged-in user's role.
export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) return <Loader text="Loading…" />; // still restoring saved login
  if (!user) return <AuthStack />; // logged out
  if (user.role === 'admin') return <AdminStack />;
  if (user.role === 'staff') return user.facilityId ? <StaffTabs /> : <StaffSetupStack />;
  return <UserTabs />; // default: normal user (patient / donor)
}
