import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import api from './api';

// Show notifications as a banner while the app is open.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Ask for permission, get this device's Expo push token, and save it on the server.
// Best-effort: push only works on a real device, so failures are ignored.
export async function registerForPush() {
  try {
    if (!Device.isDevice) return; // simulators can't receive push
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return;
    const tokenData = await Notifications.getExpoPushTokenAsync();
    await api.put('/users/push-token', { pushToken: tokenData.data });
  } catch (err) {
    // ignore (e.g. no device or no EAS project id in Expo Go)
  }
}
