import { createContext, useContext, useState } from 'react';
import AuthStack from './AuthStack';
import UserTabs from './UserTabs';
import StaffTabs from './StaffTabs';
import AdminStack from './AdminStack';

// TEMPORARY dev auth for Phase 1 so we can preview the User / Staff / Admin
// flows before real login exists. Phase 2 replaces this with context/AuthContext.js
// (reading the role from the logged-in user instead of this local state).
const DevAuthContext = createContext(null);
export const useDevAuth = () => useContext(DevAuthContext);

// RootNavigator decides which part of the app to show based on the role.
export default function RootNavigator() {
  const [role, setRole] = useState(null); // null = logged out

  let content;
  if (role === 'user') content = <UserTabs />;
  else if (role === 'staff') content = <StaffTabs />;
  else if (role === 'admin') content = <AdminStack />;
  else content = <AuthStack />;

  return <DevAuthContext.Provider value={{ role, setRole }}>{content}</DevAuthContext.Provider>;
}
