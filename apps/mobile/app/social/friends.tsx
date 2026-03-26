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
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type Friendship } from '@civique/shared';
import { getFriends, requestFriend, respondFriend } from '../../services/social';
import { useAuthStore } from '../../stores/authStore';
import { Card, Badge } from '../../components/ui';

export default function FriendsScreen() {
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [addInput, setAddInput] = useState('');
  const [sending, setSending] = useState(false);
  const user = useAuthStore((s) => s.user);

  const loadFriends = useCallback(async () => {
    if (!refreshing) setLoading(true);
    try {
      const data = await getFriends();
      setFriends(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]);

  useEffect(() => {
    loadFriends();
  }, []);

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
      Alert.alert('Erreur', 'Impossible de r\u00e9pondre');
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadFriends();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#002395" />
      }
    >
      {/* Add friend */}
      <Card style={styles.addCard}>
        <View style={styles.addHeader}>
          <Ionicons name="person-add" size={20} color="#002395" />
          <Text style={styles.addTitle}>Ajouter un ami</Text>
        </View>
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
              <Ionicons name="send" size={18} color="#FFF" />
            )}
          </TouchableOpacity>
        </View>
      </Card>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#002395" />
        </View>
      ) : (
        <>
          {/* Pending received */}
          {pendingReceived.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Demandes re{'\u00e7'}ues
                </Text>
                <Badge
                  text={String(pendingReceived.length)}
                  variant="warning"
                  size="medium"
                />
              </View>
              {pendingReceived.map((f) => (
                <Card key={f.id} style={styles.friendCard}>
                  <View style={styles.friendRow}>
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
                </Card>
              ))}
            </View>
          )}

          {/* Pending sent */}
          {pendingSent.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Demandes envoy{'\u00e9'}es
                </Text>
                <Badge
                  text={String(pendingSent.length)}
                  variant="info"
                  size="medium"
                />
              </View>
              {pendingSent.map((f) => (
                <Card key={f.id} style={styles.friendCard}>
                  <View style={styles.friendRow}>
                    <View style={styles.avatar}>
                      <Ionicons name="person" size={18} color="#FFF" />
                    </View>
                    <Text style={styles.friendName}>{f.addresseeId}</Text>
                    <Badge text="En attente" variant="warning" />
                  </View>
                </Card>
              ))}
            </View>
          )}

          {/* Accepted friends */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mes amis</Text>
              <Badge
                text={String(accepted.length)}
                variant="success"
                size="medium"
              />
            </View>
            {accepted.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={48} color="#CCC" />
                <Text style={styles.emptyText}>
                  Ajoutez des amis pour les d{'\u00e9'}fier !
                </Text>
              </View>
            ) : (
              accepted.map((f) => {
                const friendId =
                  f.requesterId === user?.id ? f.addresseeId : f.requesterId;
                return (
                  <Card key={f.id} style={styles.friendCard}>
                    <View style={styles.friendRow}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                          {friendId[0]?.toUpperCase() || '?'}
                        </Text>
                      </View>
                      <View style={styles.friendInfo}>
                        <Text style={styles.friendName}>{friendId}</Text>
                        <Text style={styles.friendSince}>
                          Ami depuis {new Date(f.createdAt).toLocaleDateString('fr-FR', {
                            month: 'short',
                            year: 'numeric',
                          })}
                        </Text>
                      </View>
                      <Ionicons name="checkmark-circle" size={22} color="#2ECC71" />
                    </View>
                  </Card>
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
    paddingBottom: 30,
  },
  center: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  addCard: {
    marginBottom: 20,
    padding: 16,
  },
  addHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  addTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  addRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  friendCard: {
    marginBottom: 8,
    padding: 14,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#002395',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  friendSince: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  acceptButton: {
    backgroundColor: '#2ECC71',
    borderRadius: 10,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineButton: {
    backgroundColor: '#ED2939',
    borderRadius: 10,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 15,
    color: '#999',
    marginTop: 12,
    textAlign: 'center',
  },
});
