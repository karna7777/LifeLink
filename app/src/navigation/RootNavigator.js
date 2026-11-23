import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import AuthStack from './AuthStack';
import UserTabs from './UserTabs';
import StaffTabs from './StaffTabs';
import AdminStack from './AdminStack';

// Decides which part of the app to show based on the logged-in user's role.
export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) return <Loader text="Loading…" />; // still restoring saved login
  if (!user) return <AuthStack />; // logged out
  if (user.role === 'staff') return <StaffTabs />;
  if (user.role === 'admin') return <AdminStack />;
  return <UserTabs />; // default: normal user (patient / donor)
}
