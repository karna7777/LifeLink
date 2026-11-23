import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, Linking, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ExpiryBadge from '../../components/ExpiryBadge';
import EmptyState from '../../components/EmptyState';
import Loader from '../../components/Loader';
import { COLORS } from '../../utils/constants';
import api from '../../services/api';

const itemLabel = (i) => (i.itemType === 'blood' ? `${i.bloodGroup || ''} ${i.component || ''}`.trim() : i.name);

// Facility details + its live stock, loaded from the server.
export default function FacilityDetailScreen({ route, navigation }) {
  const id = route.params?.id;
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/facilities/' + id);
        setFacility(data);
      } catch (err) {
        Alert.alert('Error', 'Could not load this facility.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Open the facility's coordinates in the device's maps app (no maps SDK needed).
  function openMaps() {
    const loc = facility?.location;
    if (!loc?.lat) return Alert.alert('No location', 'This facility has no saved location.');
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`);
  }

  if (loading) return <Loader text="Loading facility…" />;
  if (!facility) return <EmptyState title="Facility not found" />;

  const stock = (facility.inventory || []).filter((i) => i.quantity > 0);

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.name}>{facility.name}</Text>
      <Text style={styles.muted}>
        {facility.type?.replace('_', ' ')}
        {facility.verified ? ' · ✓ Verified' : ''}
      </Text>
      {facility.address ? <Text style={styles.muted}>{facility.address}</Text> : null}
      {facility.phone ? <Text style={styles.muted}>📞 {facility.phone}</Text> : null}

      <Button title="Open in Maps" variant="outline" style={{ marginTop: 14 }} onPress={openMaps} />

      <Text style={styles.section}>Available stock</Text>
      {stock.length === 0 ? (
        <EmptyState title="No stock listed" message="This facility hasn't listed any stock yet." />
      ) : (
        stock.map((s) => (
          <Card key={s._id}>
            <View style={styles.rowBetween}>
              <Text style={styles.itemTitle}>{itemLabel(s)}</Text>
              <ExpiryBadge expiryDate={s.expiryDate} />
            </View>
            <Text style={styles.muted}>{s.quantity} {s.unit}</Text>
          </Card>
        ))
      )}

      <Button
        title="Create request"
        style={{ marginTop: 10 }}
        onPress={() => navigation.navigate('CreateRequest', { facilityId: facility._id, facilityName: facility.name })}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, backgroundColor: COLORS.background },
  name: { fontSize: 24, fontWeight: '800', color: COLORS.text },
  muted: { color: COLORS.textMuted, marginTop: 4 },
  section: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginTop: 24, marginBottom: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
});
