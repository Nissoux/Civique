import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
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

export default function LeaderboardScreen() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [period, setPeriod] = useState<Period>('all');
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getLeaderboard(period);
      setEntries(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getMedalColor = (rank: number) => {
    if (rank === 1) return '#FFD700';
    if (rank === 2) return '#C0C0C0';
    if (rank === 3) return '#CD7F32';
    return undefined;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
        <Text style={styles.emptyText}>Aucun classement disponible</Text>
      ) : (
        entries.map((entry) => {
          const isMe = user?.id === entry.userId;
          const medalColor = getMedalColor(entry.rank);
          return (
            <View
              key={entry.rank}
              style={[styles.row, isMe && styles.rowHighlighted]}
            >
              <View style={styles.rankContainer}>
                {medalColor ? (
                  <Ionicons name="medal" size={22} color={medalColor} />
                ) : (
                  <Text style={styles.rankText}>{entry.rank}</Text>
                )}
              </View>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
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
              <Text style={styles.score}>{entry.bestScore}%</Text>
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
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 40,
  },
  periodToggle: {
    flexDirection: 'row',
    backgroundColor: '#E8E8E8',
    borderRadius: 10,
    padding: 3,
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: '#002395',
  },
  periodText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  periodTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  row: {
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
  rowHighlighted: {
    backgroundColor: '#EEF1FB',
    borderWidth: 1,
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
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002395',
  },
});
