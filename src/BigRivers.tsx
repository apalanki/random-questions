import React, { useEffect, useState } from "react";
import rivers from "./BigRivers.json";

type River = {
  country: string;
  river: string;
  pronunciation: string;
  ipa: string;
  length: number;
};

interface IncorrectQuestion extends River {
  userAnswer: string;
}

function shuffleArray(array: string[]): string[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateOptions(correctRiver: string): string[] {
  const allRivers = rivers.map((r) => r.river);
  const otherRivers = allRivers.filter((r) => r !== correctRiver);
  const shuffledOthers = shuffleArray(otherRivers);
  const options = [correctRiver, ...shuffledOthers.slice(0, 3)];
  return shuffleArray(options);
}

function speakPronunciation(text: string) {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }
}

export default function BigRivers() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [answeredCurrentQuestion, setAnsweredCurrentQuestion] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [incorrectQuestions, setIncorrectQuestions] = useState<
    IncorrectQuestion[]
  >([]);
  const [showIncorrectReview, setShowIncorrectReview] =
    useState<boolean>(false);

  const currentQuestion = rivers[currentQuestionIndex];

  useEffect(() => {
    setOptions(generateOptions(currentQuestion.river));
    setAnsweredCurrentQuestion(false);
    setSelectedAnswer(null);
  }, [currentQuestion, currentQuestionIndex]);

  const handleAnswer = (selected: string) => {
    if (answeredCurrentQuestion) return;

    setAnsweredCurrentQuestion(true);
    setSelectedAnswer(selected);

    const isCorrect = selected === currentQuestion.river;

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setIncorrectAnswers((prev) => prev + 1);
      setIncorrectQuestions((prev) => [
        ...prev,
        {
          ...currentQuestion,
          userAnswer: selected,
        },
      ]);
    }

    speakPronunciation(currentQuestion.river);
  };

  const handleNext = () => {
    if (currentQuestionIndex + 1 >= rivers.length) {
      setShowComplete(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setAnsweredCurrentQuestion(false);
    setSelectedAnswer(null);
    setShowComplete(false);
    setIncorrectQuestions([]);
    setShowIncorrectReview(false);
  };

  const isCorrect = selectedAnswer === currentQuestion.river;
  if (showIncorrectReview) {
    return (
      <div className="container">
        <h1>🏞️ River Practice Quiz</h1>
        <p className="subtitle">Review your incorrect answers</p>

        <div className="card">
          <div style={{ marginBottom: "var(--space-24)" }}>
            <h2
              style={{
                fontSize: "var(--font-size-2xl)",
                marginBottom: "var(--space-16)",
              }}
            >
              Incorrect Questions ({incorrectQuestions.length})
            </h2>
            {incorrectQuestions.length === 0 ? (
              <p style={{ color: "var(--color-text-secondary)" }}>
                🎉 Perfect score! No incorrect answers to review.
              </p>
            ) : (
              incorrectQuestions.map((question, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "var(--space-20)",
                    padding: "var(--space-16)",
                    background: "var(--color-secondary)",
                    borderRadius: "var(--radius-base)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "var(--font-weight-semibold)",
                      marginBottom: "var(--space-8)",
                      fontSize: "var(--font-size-lg)",
                    }}
                  >
                    {question.country}
                  </div>
                  <div style={{ marginBottom: "var(--space-8)" }}>
                    <span style={{ color: "var(--color-error)" }}>
                      Your answer: {question.userAnswer}
                    </span>
                  </div>
                  <div style={{ marginBottom: "var(--space-8)" }}>
                    <span
                      style={{
                        color: "var(--color-success)",
                        fontWeight: "var(--font-weight-medium)",
                      }}
                    >
                      Correct answer: {question.river}
                    </span>
                  </div>
                  <div className="pronunciation">
                    <span className="pronunciation-text">
                      {question.pronunciation}
                    </span>
                    <button
                      className="audio-btn"
                      onClick={() => speakPronunciation(question.river)}
                      title="Play pronunciation"
                    >
                      🔊
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="btn-group">
            <button
              className="btn"
              onClick={() => setShowIncorrectReview(false)}
            >
              Back to Results
            </button>
            <button className="btn-secondary btn" onClick={handleRestart}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showComplete) {
    return (
      <div className="container">
        <h1>🏞️ River Practice Quiz</h1>
        <p className="subtitle">
          Test your knowledge of the longest rivers from {rivers.length}{" "}
          countries
        </p>

        <div className="card complete-screen">
          <div className="complete-title">🎉 Quiz Complete!</div>
          <div className="final-score">
            You got <strong>{correctAnswers}</strong> out of{" "}
            <strong>{rivers.length}</strong> correct
          </div>
          <div className="btn-group">
            {incorrectQuestions.length > 0 && (
              <button
                className="btn-secondary btn"
                onClick={() => setShowIncorrectReview(true)}
              >
                Review Incorrect ({incorrectQuestions.length})
              </button>
            )}
            <button className="btn" onClick={handleRestart}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>🏞️ River Practice Quiz</h1>
      <p className="subtitle">
        Test your knowledge of the longest rivers from {rivers.length} countries
      </p>

      <div className="card score-card">
        <div className="score-item">
          <div className="score-label">Correct</div>
          <div className="score-value">{correctAnswers}</div>
        </div>
        <div className="score-item">
          <div className="score-label">Question</div>
          <div className="score-value">
            {currentQuestionIndex + 1} / {rivers.length}
          </div>
        </div>
        <div className="score-item">
          <div className="score-label">Incorrect</div>
          <div className="score-value">{incorrectAnswers}</div>
        </div>
      </div>

      <div className="card quiz-section">
        <div className="question-header">
          <div className="country-name">{currentQuestion.country}</div>
          <div className="question-prompt">What is the longest river?</div>
        </div>

        {answeredCurrentQuestion && (
          <div className="river-display">
            <div className="river-name">{currentQuestion.river}</div>
            <div className="pronunciation">
              <span className="pronunciation-text">
                {currentQuestion.pronunciation}
              </span>
              <button
                className="audio-btn"
                onClick={() => speakPronunciation(currentQuestion.river)}
                title="Play pronunciation"
              >
                🔊
              </button>
            </div>
            <div
              style={{
                fontSize: "var(--font-size-sm)",
                color: "var(--color-text-secondary)",
                marginTop: "var(--space-8)",
              }}
            >
              Length: {currentQuestion.length.toLocaleString()} km
            </div>
          </div>
        )}

        {answeredCurrentQuestion && (
          <div className={`feedback ${isCorrect ? "correct" : "incorrect"}`}>
            {isCorrect
              ? "✓ Correct! Well done!"
              : `✗ Incorrect. The correct answer is ${currentQuestion.river}.`}
          </div>
        )}

        <div className="options">
          {options.map((option, index) => {
            let btnClass = "option-btn";
            if (answeredCurrentQuestion) {
              if (option === currentQuestion.river) {
                btnClass += " correct";
              } else if (option === selectedAnswer && !isCorrect) {
                btnClass += " incorrect";
              }
            }

            return (
              <button
                key={index}
                className={btnClass}
                onClick={() => handleAnswer(option)}
                disabled={answeredCurrentQuestion}
              >
                {option}
              </button>
            );
          })}
        </div>

        {answeredCurrentQuestion && (
          <div className="btn-group">
            <button className="btn" onClick={handleNext}>
              Next Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
