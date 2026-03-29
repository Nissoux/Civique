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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type Challenge, type ChallengeStatus } from '@civique/shared';
import { getChallenges, createChallenge } from '../../services/social';
import { useAuthStore } from '../../stores/authStore';

const STATUS_CONFIG: Record<ChallengeStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'En attente', color: '#F57C00', bg: '#FFF3E0' },
  active: { label: 'En cours', color: '#002395', bg: '#EEF1FB' },
  completed: { label: 'Terminé', color: '#2ECC71', bg: '#E8F5E9' },
  declined: { label: 'Refusé', color: '#999', bg: '#F0F0F0' },
};

export default function ChallengesScreen() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [challengeTarget, setChallengeTarget] = useState('');
  const [creating, setCreating] = useState(false);
  const user = useAuthStore((s) => s.user);

  const loadChallenges = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getChallenges();
      setChallenges(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  const handleCreate = async () => {
    if (!challengeTarget.trim()) return;
    setCreating(true);
    try {
      await createChallenge({ challengedId: challengeTarget.trim() });
      setChallengeTarget('');
      setShowCreate(false);
      loadChallenges();
    } catch {
      Alert.alert('Erreur', 'Impossible de créer le défi');
    } finally {
      setCreating(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setShowCreate(!showCreate)}
      >
        <Ionicons name="add-circle" size={20} color="#FFF" />
        <Text style={styles.createButtonText}>Nouveau défi</Text>
      </TouchableOpacity>

      {showCreate && (
        <View style={styles.createCard}>
          <Text style={styles.createLabel}>Défier un ami</Text>
          <View style={styles.createRow}>
            <TextInput
              style={styles.input}
              placeholder="ID de l'ami..."
              placeholderTextColor="#AAA"
              value={challengeTarget}
              onChangeText={setChallengeTarget}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={[styles.sendButton, !challengeTarget.trim() && styles.sendButtonDisabled]}
              onPress={handleCreate}
              disabled={!challengeTarget.trim() || creating}
            >
              {creating ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.sendButtonText}>Envoyer</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#002395" />
        </View>
      ) : challenges.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="trophy-outline" size={48} color="#CCC" />
          <Text style={styles.emptyText}>Aucun défi pour le moment</Text>
          <Text style={styles.emptySubtext}>
            Défiez vos amis pour comparer vos scores !
          </Text>
        </View>
      ) : (
        challenges.map((ch) => {
          const isSent = ch.challengerId === user?.id;
          const opponentId = isSent ? ch.challengedId : ch.challengerId;
          const config = STATUS_CONFIG[ch.status];
          return (
            <View key={ch.id} style={styles.challengeCard}>
              <View style={styles.challengeHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {opponentId[0]?.toUpperCase() || '?'}
                  </Text>
                </View>
                <View style={styles.challengeInfo}>
                  <Text style={styles.challengeName}>
                    {isSent ? 'vs ' : ''}
                    {opponentId}
                  </Text>
                  <Text style={styles.challengeMeta}>
                    {ch.questionCount} questions
                    {ch.themeId ? ` \u2022 Thème ${ch.themeId}` : ''}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
                  <Text style={[styles.statusText, { color: config.color }]}>
                    {config.label}
                  </Text>
                </View>
              </View>

              {ch.status === 'completed' && (
                <View style={styles.scoreRow}>
                  <View style={styles.scoreCol}>
                    <Text style={styles.scoreLabel}>Vous</Text>
                    <Text style={styles.scoreValue}>
                      {isSent ? ch.challengerScore : ch.challengedScore ?? '-'}%
                    </Text>
                  </View>
                  <Ionicons name="swap-horizontal" size={20} color="#CCC" />
                  <View style={styles.scoreCol}>
                    <Text style={styles.scoreLabel}>Adversaire</Text>
                    <Text style={styles.scoreValue}>
                      {isSent ? ch.challengedScore : ch.challengerScore ?? '-'}%
                    </Text>
                  </View>
                </View>
              )}
            </View>
          );
        })
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#002395',
    borderRadius: 12,
    padding: 14,
    gap: 8,
    marginBottom: 16,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  createCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  createLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  createRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#002395',
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#BBB',
    marginTop: 4,
  },
  challengeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  challengeHeader: {
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
  challengeInfo: {
    flex: 1,
  },
  challengeName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  challengeMeta: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
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
  },
  scoreLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#002395',
  },
});
