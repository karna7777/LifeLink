import * as Location from 'expo-location';

// Ask for location permission and return the device's current { lat, lng }.
// Returns null if permission is denied or the location can't be read.
export async function getCurrentLocation() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return null;
    const pos = await Location.getCurrentPositionAsync({});
    return { lat: pos.coords.latitude, lng: pos.coords.longitude };
  } catch (err) {
    return null;
  }
}
