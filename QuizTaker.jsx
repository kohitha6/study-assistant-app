import React, { useState } from 'react';

export default function QuizTaker({ quiz }) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectedAnswer, setSelectedAnswer] = useState(null);

	if (!quiz || quiz.length === 0) return <p>No quiz questions available.</p>;

	const currentQuestion = quiz[currentIndex];
	const isCorrect = selectedAnswer !== null && selectedAnswer === currentQuestion.answer;

	const handleAnswer = (answer) => {
		setSelectedAnswer(answer);
	};

	const handleNext = () => {
		setSelectedAnswer(null);
		setCurrentIndex((previousIndex) => (previousIndex + 1) % quiz.length);
	};

	return (
		<section className="quiz-container">
			<p>Question {currentIndex + 1} of {quiz.length}</p>
			<h2>{currentQuestion.question}</h2>
			<div className="quiz-options">
				{currentQuestion.options.map((option) => (
					<button
						key={option}
						type="button"
						onClick={() => handleAnswer(option)}
						disabled={selectedAnswer !== null}
					>
						{option}
					</button>
				))}
			</div>
			{selectedAnswer !== null && (
				<p>{isCorrect ? 'Correct!' : `The correct answer is ${currentQuestion.answer}.`}</p>
			)}
			{selectedAnswer !== null && (
				<button type="button" onClick={handleNext}>Next question</button>
			)}
		</section>
	);
}
