import React, { useState, useEffect, useMemo } from "react";
import "./styles/style.scss";

const App = () => {
  const [name, setName] = useState(() => {
    const storedName = localStorage.getItem("name");
    return storedName || "";
  });
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [message, setMessage] = useState("");
  const [questions, setQuestions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  // const numbers = [17, 75, 64, 98, 94, 445, 45, 19, 0, 199, 165, 999];
  const numbers = useMemo(
    () => [17, 75, 64, 98, 94, 445, 45, 19, 0, 199, 165, 999],
    []
  );

  useEffect(() => {
    const generateQuestions = () => {
      return numbers.map((number) => {
        const correctAnswer = Math.round(number / 10) * 10;
        const options = new Set([correctAnswer]);

        while (options.size < 4) {
          const randomOffset = Math.floor(Math.random() * 20) - 10;
          const option = correctAnswer + randomOffset;
          if (option >= 0) {
            options.add(option);
          }
        }

        return {
          id: number,
          number,
          options: Array.from(options),
        };
      });
    };

    setQuestions(generateQuestions());
  }, [numbers]);

  const handleAnswer = (questionIndex, option) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = option;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setMessage("Please fill in your name.");
      setIsModalVisible(true);
      return;
    }

    localStorage.setItem("name", name);
    if (answers.length !== numbers.length) {
      setMessage(`Dear ${name}, you have not answered all the questions.`);
      setIsModalVisible(true);
      return;
    }
    const correctAnswers = numbers.map(
      (number) => Math.round(number / 10) * 10
    );
    let calculatedScore = 0;
    answers.forEach((answer, index) => {
      if (answer === correctAnswers[index]) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    setMessage(
      `Dear ${name}, Your score is ${calculatedScore} out of ${numbers.length}.`
    );
    setIsModalVisible(true);
    setAnswers([]);
  };

  const handleReset = () => {
    setName("");
    setScore(0);
    setAnswers([]);
    // localStorage.removeItem("name");
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setMessage("");
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Rounding Off to the Nearest 10</h1>
        <div className="input-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter your name"
          />
        </div>
        <div className="score-display">
          <label htmlFor="score">Score:</label>
          <input id="score" type="text" value={score ?? "-"} readOnly />
        </div>
      </header>

      <main className="quiz">
        <h2>Choose the correct answers.</h2>

        <ol>
          {questions.map((q, index) => (
            <li key={q.id}>
              <p>{q.number} rounded off to the nearest 10 is:</p>
              <div className="options">
                {q.options.map((option) => (
                  <button
                    key={option}
                    className={`option-button ${
                      answers[index] === option ? "selected" : ""
                    }`}
                    onClick={() => handleAnswer(index, option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ol>

        <div className="actions">
          <button
            onClick={handleSubmit}
            // disabled={!name.trim()}
          >
            Submit
          </button>
          <button onClick={handleReset}>Reset</button>
        </div>
        {isModalVisible && (
          <div className="modal-overlay">
            <div className="modal-content">
              <p>{message}</p>
              <button className="close-button" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        )}
      </main>
      <footer className="footer">
        <p>
          &copy;{" "}
          <a
            href="https://www.mathinenglish.com"
            rel="noreferrer"
            target="_blank"
          >
            www.mathinenglish.com
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
