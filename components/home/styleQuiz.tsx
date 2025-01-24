import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { COLORS } from "../../styles/colors";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: "1",
    question: `What's your preferred style?`,
    options: ["Casual", "Formal", "Bohemian", "Minimalist"],
  },
  {
    id: "2",
    question: "Which color palette do you prefer?",
    options: ["Neutrals", "Pastels", "Bold colors", "Monochrome"],
  },
];

export const StyleQuiz: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const handleAnswer = (answer: string) => {
    setAnswers([...answers, answer]);
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed, you can handle the results here
      console.log("Quiz completed", answers);
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Take Style Quiz</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.question}>
              {quizQuestions[currentQuestion].question}
            </Text>
            {quizQuestions[currentQuestion].options.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.optionButton}
                onPress={() => handleAnswer(option)}>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  button: {
    backgroundColor: COLORS.green,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "PoppinsMedium",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  question: {
    fontSize: 20,
    fontFamily: "PoppinsMedium",
    marginBottom: 20,
    textAlign: "center",
  },
  optionButton: {
    backgroundColor: COLORS.green,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  optionText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontFamily: "Poppins",
    textAlign: "center",
  },
});
