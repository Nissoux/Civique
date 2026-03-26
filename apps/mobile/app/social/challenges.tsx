import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
  Pressable,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { type Challenge, type ChallengeStatus, THEMES } from '@civique/shared';
import { getChallenges, createChallenge } from '../../services/social';
import { useAuthStore } from '../../stores/authStore';
import { Card, Button } from '../../components/ui';

const STATUS_CONFIG: Record<ChallengeStatus, { label: string; color: string; bg: string; icon: React.ComponentProps<typeof Ionicons>['name'] }> = {
  pending: { label: 'En attente', color: '#F57C00', bg: '#FFF3E0', icon: 'time' },
  active: { label: 'En cours', color: '#002395', bg: '#EEF1FB', icon: 'play-circle' },
  completed: { label: 'Termin\u00e9', color: '#2ECC71', bg: '#E8F5E9', icon: 'checkmark-circle' },
  declined: { label: 'Refus\u00e9', color: '#999', bg: '#F0F0F0', icon: 'close-circle' },
};

type Tab = 'mine' | 'invitations';

export default function ChallengesScreen() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('mine');
  const [challengeTarget, setChallengeTarget] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<number | undefined>();
  const [questionCount, setQuestionCount] = useState('10');
  const [creating, setCreating] = useState(false);
  const user = useAuthStore((s) => s.user);

  const loadChallenges = useCallback(async () => {
    if (!refreshing) setLoading(true);
    try {
      const data = await getChallenges();
      setChallenges(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]);

  useEffect(() => {
    loadChallenges();
  }, []);

  const myChallenges = challenges.filter((ch) => ch.challengerId === user?.id);
  const invitations = challenges.filter((ch) => ch.challengedId === user?.id);
  const displayList = activeTab === 'mine' ? myChallenges : invitations;

  const handleCreate = async () => {
    if (!challengeTarget.trim()) return;
    setCreating(true);
    try {
      await createChallenge({
        challengedId: challengeTarget.trim(),
        themeId: selectedTheme,
        questionCount: parseInt(questionCount, 10) || 10,
      });
      setChallengeTarget('');
      setSelectedTheme(undefined);
      setQuestionCount('10');
      setShowCreate(false);
      loadChallenges();
    } catch {
      Alert.alert('Erreur', 'Impossible de cr\u00e9er le d\u00e9fi');
    } finally {
      setCreating(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadChallenges();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#002395" />
        }
      >
        {/* Tab selector */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'mine' && styles.tabActive]}
            onPress={() => setActiveTab('mine')}
          >
            <Text style={[styles.tabText, activeTab === 'mine' && styles.tabTextActive]}>
              Mes d{'\u00e9'}fis ({myChallenges.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'invitations' && styles.tabActive]}
            onPress={() => setActiveTab('invitations')}
          >
            <Text style={[styles.tabText, activeTab === 'invitations' && styles.tabTextActive]}>
              Invitations ({invitations.length})
            </Text>
            {invitations.filter((i) => i.status === 'pending').length > 0 && (
              <View style={styles.notifDot} />
            )}
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#002395" />
          </View>
        ) : displayList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name={activeTab === 'mine' ? 'flash-outline' : 'mail-outline'}
              size={48}
              color="#CCC"
            />
            <Text style={styles.emptyText}>
              {activeTab === 'mine'
                ? 'Aucun d\u00e9fi pour le moment'
                : 'Aucune invitation'}
            </Text>
            <Text style={styles.emptySubtext}>
              {activeTab === 'mine'
                ? 'D\u00e9fiez vos amis pour comparer vos scores !'
                : 'Les d\u00e9fis de vos amis appara\u00eetront ici'}
            </Text>
          </View>
        ) : (
          displayList.map((ch) => {
            const isSent = ch.challengerId === user?.id;
            const opponentId = isSent ? ch.challengedId : ch.challengerId;
            const config = STATUS_CONFIG[ch.status];
            const theme = ch.themeId
              ? THEMES.find((t) => t.id === ch.themeId)
              : undefined;

            return (
              <Card key={ch.id} style={styles.challengeCard}>
                <View style={styles.challengeHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {opponentId[0]?.toUpperCase() || '?'}
                    </Text>
                  </View>
                  <View style={styles.challengeInfo}>
                    <Text style={styles.challengeName}>
                      {isSent ? 'D\u00e9fi envoy\u00e9' : 'D\u00e9fi re\u00e7u'}
                    </Text>
                    <Text style={styles.challengeOpponent}>
                      vs {opponentId}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
                    <Ionicons name={config.icon} size={14} color={config.color} />
                    <Text style={[styles.statusText, { color: config.color }]}>
                      {config.label}
                    </Text>
                  </View>
                </View>

                {/* Challenge details */}
                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <Ionicons name="help-circle-outline" size={16} color="#999" />
                    <Text style={styles.detailText}>
                      {ch.questionCount} questions
                    </Text>
                  </View>
                  {theme && (
                    <View style={styles.detailItem}>
                      <View
                        style={[styles.themeDot, { backgroundColor: theme.color }]}
                      />
                      <Text style={styles.detailText}>{theme.nameFr}</Text>
                    </View>
                  )}
                </View>

                {ch.status === 'completed' && (
                  <View style={styles.scoreRow}>
                    <View style={styles.scoreCol}>
                      <Text style={styles.scoreLabel}>Vous</Text>
                      <Text
                        style={[
                          styles.scoreValue,
                          {
                            color:
                              (isSent ? ch.challengerScore : ch.challengedScore ?? 0) >=
                              (isSent ? ch.challengedScore : ch.challengerScore ?? 0)
                                ? '#2ECC71'
                                : '#ED2939',
                          },
                        ]}
                      >
                        {isSent ? ch.challengerScore : ch.challengedScore ?? '-'}%
                      </Text>
                    </View>
                    <View style={styles.vsCircle}>
                      <Text style={styles.vsText}>VS</Text>
                    </View>
                    <View style={styles.scoreCol}>
                      <Text style={styles.scoreLabel}>Adversaire</Text>
                      <Text style={styles.scoreValue}>
                        {isSent ? ch.challengedScore : ch.challengerScore ?? '-'}%
                      </Text>
                    </View>
                  </View>
                )}
              </Card>
            );
          })
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowCreate(true)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#002395', '#1a3fad']}
          style={styles.fabGradient}
        >
          <Ionicons name="flash" size={24} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Create challenge modal */}
      <Modal
        visible={showCreate}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreate(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowCreate(false)}>
          <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Lancer un d{'\u00e9'}fi</Text>

            <Text style={styles.inputLabel}>Ami (email ou ID)</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez l'identifiant de votre ami..."
              placeholderTextColor="#AAA"
              value={challengeTarget}
              onChangeText={setChallengeTarget}
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Th{'\u00e8'}me (optionnel)</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.themeScroll}
            >
              <TouchableOpacity
                style={[
                  styles.themeChip,
                  !selectedTheme && styles.themeChipSelected,
                ]}
                onPress={() => setSelectedTheme(undefined)}
              >
                <Text
                  style={[
                    styles.themeChipText,
                    !selectedTheme && styles.themeChipTextSelected,
                  ]}
                >
                  Tous
                </Text>
              </TouchableOpacity>
              {THEMES.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[
                    styles.themeChip,
                    selectedTheme === t.id && {
                      backgroundColor: t.color,
                      borderColor: t.color,
                    },
                  ]}
                  onPress={() => setSelectedTheme(t.id)}
                >
                  <Text
                    style={[
                      styles.themeChipText,
                      selectedTheme === t.id && { color: '#FFFFFF' },
                    ]}
                    numberOfLines={1}
                  >
                    {t.nameFr}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.inputLabel}>Nombre de questions</Text>
            <View style={styles.countRow}>
              {['5', '10', '20'].map((n) => (
                <TouchableOpacity
                  key={n}
                  style={[
                    styles.countChip,
                    questionCount === n && styles.countChipSelected,
                  ]}
                  onPress={() => setQuestionCount(n)}
                >
                  <Text
                    style={[
                      styles.countChipText,
                      questionCount === n && styles.countChipTextSelected,
                    ]}
                  >
                    {n}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button
              title="Envoyer le d\u00e9fi"
              onPress={handleCreate}
              loading={creating}
              disabled={!challengeTarget.trim()}
              icon="flash"
              style={{ marginTop: 20 }}
              size="large"
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  center: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#E8E8E8',
    borderRadius: 12,
    padding: 3,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  tabActive: {
    backgroundColor: '#002395',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  notifDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ED2939',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#BBB',
    marginTop: 4,
    textAlign: 'center',
  },
  challengeCard: {
    marginBottom: 10,
    padding: 16,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#002395',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  challengeInfo: {
    flex: 1,
  },
  challengeName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  challengeOpponent: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#999',
  },
  themeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 20,
  },
  scoreCol: {
    alignItems: 'center',
    flex: 1,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#002395',
  },
  vsCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#999',
  },
  // FAB
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    borderRadius: 28,
    shadowColor: '#002395',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDD',
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  themeScroll: {
    marginBottom: 16,
  },
  themeChip: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  themeChipSelected: {
    backgroundColor: '#002395',
    borderColor: '#002395',
  },
  themeChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  themeChipTextSelected: {
    color: '#FFFFFF',
  },
  countRow: {
    flexDirection: 'row',
    gap: 10,
  },
  countChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
  },
  countChipSelected: {
    backgroundColor: '#EEF1FB',
    borderColor: '#002395',
  },
  countChipText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  countChipTextSelected: {
    color: '#002395',
  },
});
