import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';

export default function ExamSessionScreen() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes in seconds
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          router.replace('/exam/results');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const choices = [
    { id: 'a', text: 'R\u00e9ponse A' },
    { id: 'b', text: 'R\u00e9ponse B' },
    { id: 'c', text: 'R\u00e9ponse C' },
    { id: 'd', text: 'R\u00e9ponse D' },
  ];

  const handleNext = () => {
    if (currentQuestion >= 19) {
      router.replace('/exam/results');
    } else {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedChoice(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.progress}>
          {currentQuestion + 1} / 20
        </Text>
        <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[styles.progressFill, { width: `${((currentQuestion + 1) / 20) * 100}%` }]}
        />
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.questionText}>
          Question {currentQuestion + 1} - Cette question sera charg\u00e9e depuis l'API.
        </Text>
      </View>

      <View style={styles.choices}>
        {choices.map((choice) => (
          <TouchableOpacity
            key={choice.id}
            style={[
              styles.choiceButton,
              selectedChoice === choice.id && styles.choiceSelected,
            ]}
            onPress={() => setSelectedChoice(choice.id)}
          >
            <Text
              style={[
                styles.choiceId,
                selectedChoice === choice.id && styles.choiceTextSelected,
              ]}
            >
              {choice.id.toUpperCase()}
            </Text>
            <Text
              style={[
                styles.choiceText,
                selectedChoice === choice.id && styles.choiceTextSelected,
              ]}
            >
              {choice.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.nextButton, !selectedChoice && styles.nextButtonDisabled]}
        onPress={handleNext}
        disabled={!selectedChoice}
      >
        <Text style={styles.nextButtonText}>
          {currentQuestion >= 19 ? 'Terminer' : 'Suivant'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ED2939',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 24,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#002395',
    borderRadius: 3,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    minHeight: 120,
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 26,
  },
  choices: {
    gap: 12,
    marginBottom: 24,
  },
  choiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#EEE',
  },
  choiceSelected: {
    borderColor: '#002395',
    backgroundColor: '#002395',
  },
  choiceId: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    textAlign: 'center',
    lineHeight: 32,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 12,
    fontSize: 14,
  },
  choiceText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  choiceTextSelected: {
    color: '#FFFFFF',
  },
  nextButton: {
    backgroundColor: '#002395',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#CCC',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
