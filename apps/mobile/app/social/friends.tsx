import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type Friendship } from '@civique/shared';
import { getFriends, requestFriend, respondFriend } from '../../services/social';
import { useAuthStore } from '../../stores/authStore';

export default function FriendsScreen() {
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);
  const [addInput, setAddInput] = useState('');
  const [sending, setSending] = useState(false);
  const user = useAuthStore((s) => s.user);

  const loadFriends = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFriends();
      setFriends(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  const accepted = friends.filter((f) => f.status === 'accepted');
  const pendingReceived = friends.filter(
    (f) => f.status === 'pending' && f.addresseeId === user?.id
  );
  const pendingSent = friends.filter(
    (f) => f.status === 'pending' && f.requesterId === user?.id
  );

  const handleSendRequest = async () => {
    if (!addInput.trim()) return;
    setSending(true);
    try {
      await requestFriend(addInput.trim());
      setAddInput('');
      loadFriends();
    } catch {
      Alert.alert('Erreur', "Impossible d'envoyer la demande");
    } finally {
      setSending(false);
    }
  };

  const handleRespond = async (id: number, status: 'accepted' | 'declined') => {
    try {
      await respondFriend(id, status);
      loadFriends();
    } catch {
      Alert.alert('Erreur', 'Impossible de répondre');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Add friend */}
      <View style={styles.addSection}>
        <Text style={styles.sectionTitle}>Ajouter un ami</Text>
        <View style={styles.addRow}>
          <TextInput
            style={styles.input}
            placeholder="Email ou identifiant..."
            placeholderTextColor="#AAA"
            value={addInput}
            onChangeText={setAddInput}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={[styles.addButton, !addInput.trim() && styles.addButtonDisabled]}
            onPress={handleSendRequest}
            disabled={!addInput.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Ionicons name="person-add" size={18} color="#FFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#002395" />
        </View>
      ) : (
        <>
          {/* Pending requests */}
          {pendingReceived.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Demandes reçues ({pendingReceived.length})
              </Text>
              {pendingReceived.map((f) => (
                <View key={f.id} style={styles.friendRow}>
                  <View style={styles.avatar}>
                    <Ionicons name="person" size={18} color="#FFF" />
                  </View>
                  <Text style={styles.friendName}>{f.requesterId}</Text>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => handleRespond(f.id, 'accepted')}
                  >
                    <Ionicons name="checkmark" size={18} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.declineButton}
                    onPress={() => handleRespond(f.id, 'declined')}
                  >
                    <Ionicons name="close" size={18} color="#FFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Pending sent */}
          {pendingSent.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Demandes envoyées ({pendingSent.length})
              </Text>
              {pendingSent.map((f) => (
                <View key={f.id} style={styles.friendRow}>
                  <View style={styles.avatar}>
                    <Ionicons name="person" size={18} color="#FFF" />
                  </View>
                  <Text style={styles.friendName}>{f.addresseeId}</Text>
                  <View style={styles.pendingBadge}>
                    <Text style={styles.pendingText}>En attente</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Accepted friends */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mes amis ({accepted.length})</Text>
            {accepted.length === 0 ? (
              <Text style={styles.emptyText}>
                Ajoutez des amis pour les défier !
              </Text>
            ) : (
              accepted.map((f) => {
                const friendId =
                  f.requesterId === user?.id ? f.addresseeId : f.requesterId;
                return (
                  <View key={f.id} style={styles.friendRow}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {friendId[0]?.toUpperCase() || '?'}
                      </Text>
                    </View>
                    <Text style={styles.friendName}>{friendId}</Text>
                    <Ionicons name="checkmark-circle" size={20} color="#2ECC71" />
                  </View>
                );
              })
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
  },
  center: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  addSection: {
    marginBottom: 24,
  },
  addRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  addButton: {
    backgroundColor: '#002395',
    borderRadius: 12,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#002395',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  friendName: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  acceptButton: {
    backgroundColor: '#2ECC71',
    borderRadius: 8,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineButton: {
    backgroundColor: '#ED2939',
    borderRadius: 8,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingBadge: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pendingText: {
    fontSize: 12,
    color: '#F57C00',
    fontWeight: '600',
  },
});
