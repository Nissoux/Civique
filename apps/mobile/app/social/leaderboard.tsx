import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getLeaderboard, type LeaderboardEntry } from '../../services/social';
import { useAuthStore } from '../../stores/authStore';

type Period = 'week' | 'month' | 'all';
const PERIOD_LABELS: Record<Period, string> = {
  week: 'Semaine',
  month: 'Mois',
  all: 'Tout',
};

const MEDAL_COLORS = {
  1: { primary: '#FFD700', secondary: '#FFC107', bg: '#FFF8E1' },
  2: { primary: '#C0C0C0', secondary: '#A0A0A0', bg: '#F5F5F5' },
  3: { primary: '#CD7F32', secondary: '#B8722D', bg: '#FFF3E0' },
} as const;

export default function LeaderboardScreen() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [period, setPeriod] = useState<Period>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = useAuthStore((s) => s.user);

  const loadData = useCallback(async () => {
    if (!refreshing) setLoading(true);
    try {
      const data = await getLeaderboard(period);
      setEntries(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [period, refreshing]);

  useEffect(() => {
    loadData();
  }, [period]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#002395" />
      }
    >
      {/* Period selector */}
      <View style={styles.periodToggle}>
        {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.periodButton, p === period && styles.periodButtonActive]}
            onPress={() => setPeriod(p)}
          >
            <Text style={[styles.periodText, p === period && styles.periodTextActive]}>
              {PERIOD_LABELS[p]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#002395" />
        </View>
      ) : entries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="trophy-outline" size={48} color="#CCC" />
          <Text style={styles.emptyText}>Aucun classement disponible</Text>
          <Text style={styles.emptySubtext}>
            Passez des examens pour appara{'\u00ee'}tre ici !
          </Text>
        </View>
      ) : (
        <>
          {/* Podium - Top 3 */}
          {top3.length >= 3 && (
            <View style={styles.podium}>
              {/* 2nd place */}
              <View style={styles.podiumSlot}>
                {renderPodiumEntry(top3[1], 2, user?.id)}
                <View style={[styles.podiumBar, styles.podiumBar2]}>
                  <Text style={styles.podiumRank}>2</Text>
                </View>
              </View>
              {/* 1st place */}
              <View style={styles.podiumSlot}>
                {renderPodiumEntry(top3[0], 1, user?.id)}
                <View style={[styles.podiumBar, styles.podiumBar1]}>
                  <Text style={styles.podiumRank}>1</Text>
                </View>
              </View>
              {/* 3rd place */}
              <View style={styles.podiumSlot}>
                {renderPodiumEntry(top3[2], 3, user?.id)}
                <View style={[styles.podiumBar, styles.podiumBar3]}>
                  <Text style={styles.podiumRank}>3</Text>
                </View>
              </View>
            </View>
          )}

          {/* Rest of the list */}
          {rest.map((entry) => {
            const isMe = user?.id === entry.userId;
            return (
              <View
                key={entry.rank}
                style={[styles.row, isMe && styles.rowHighlighted]}
              >
                <View style={styles.rankContainer}>
                  <Text style={styles.rankText}>{entry.rank}</Text>
                </View>
                <View style={styles.rowAvatar}>
                  <Text style={styles.rowAvatarText}>
                    {(entry.displayName || '?')[0].toUpperCase()}
                  </Text>
                </View>
                <View style={styles.info}>
                  <Text style={[styles.name, isMe && styles.nameHighlighted]}>
                    {entry.displayName}
                    {isMe ? ' (vous)' : ''}
                  </Text>
                  <Text style={styles.meta}>
                    {entry.examCount} examen{entry.examCount !== 1 ? 's' : ''}
                  </Text>
                </View>
                <View style={styles.scoreContainer}>
                  <Text style={styles.score}>{entry.bestScore}%</Text>
                </View>
              </View>
            );
          })}
        </>
      )}
    </ScrollView>
  );
}

function renderPodiumEntry(
  entry: LeaderboardEntry,
  rank: 1 | 2 | 3,
  currentUserId?: string
) {
  const medal = MEDAL_COLORS[rank];
  const isMe = currentUserId === entry.userId;
  const avatarSize = rank === 1 ? 56 : 48;

  return (
    <View style={styles.podiumEntry}>
      {rank === 1 && (
        <Ionicons name="crown" size={24} color="#FFD700" style={{ marginBottom: 4 }} />
      )}
      <View
        style={[
          styles.podiumAvatar,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
            borderColor: medal.primary,
          },
          isMe && { borderColor: '#002395' },
        ]}
      >
        <Text
          style={[
            styles.podiumAvatarText,
            { fontSize: rank === 1 ? 22 : 18 },
          ]}
        >
          {(entry.displayName || '?')[0].toUpperCase()}
        </Text>
      </View>
      <Text
        style={[styles.podiumName, isMe && styles.podiumNameMe]}
        numberOfLines={1}
      >
        {isMe ? 'Vous' : entry.displayName}
      </Text>
      <View style={[styles.podiumScoreBadge, { backgroundColor: medal.bg }]}>
        <Text style={[styles.podiumScore, { color: medal.primary }]}>
          {entry.bestScore}%
        </Text>
      </View>
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
    paddingBottom: 30,
  },
  center: {
    paddingVertical: 40,
    alignItems: 'center',
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
  },
  periodToggle: {
    flexDirection: 'row',
    backgroundColor: '#E8E8E8',
    borderRadius: 12,
    padding: 3,
    marginBottom: 24,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  periodButtonActive: {
    backgroundColor: '#002395',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  periodTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Podium styles
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  podiumSlot: {
    flex: 1,
    alignItems: 'center',
  },
  podiumEntry: {
    alignItems: 'center',
    marginBottom: 8,
  },
  podiumAvatar: {
    backgroundColor: '#002395',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    marginBottom: 6,
  },
  podiumAvatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  podiumName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    maxWidth: 80,
  },
  podiumNameMe: {
    color: '#002395',
  },
  podiumScoreBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 4,
  },
  podiumScore: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  podiumBar: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  podiumBar1: {
    height: 80,
    backgroundColor: '#FFD700',
  },
  podiumBar2: {
    height: 60,
    backgroundColor: '#C0C0C0',
  },
  podiumBar3: {
    height: 44,
    backgroundColor: '#CD7F32',
  },
  podiumRank: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  // List row styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  rowHighlighted: {
    backgroundColor: '#EEF1FB',
    borderWidth: 1.5,
    borderColor: '#002395',
  },
  rankContainer: {
    width: 30,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#999',
  },
  rowAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#002395',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  nameHighlighted: {
    color: '#002395',
  },
  meta: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  scoreContainer: {
    backgroundColor: '#EEF1FB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#002395',
  },
});
