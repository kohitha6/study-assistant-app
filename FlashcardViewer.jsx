import React, { useState } from 'react';

export default function FlashcardViewer({ flashcards }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    if (!flashcards || flashcards.length === 0) return <p>No flashcards available.</p>;

    const currentCard = flashcards[currentIndex];

    const handleNext = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    };

    return (
        <div className="flashcard-container">
            <div 
                className={`flashcard ${isFlipped ? 'flipped' : ''}`} 
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <div className="card-face card-front">
                    <span className="card-badge">Front</span>
                    <p>{currentCard.front}</p>
                    <small>Click to flip</small>
                </div>
                <div className="card-face card-back">
                    <span className="card-badge">Back</span>
                    <p>{currentCard.back}</p>
                    <small>Click to flip</small>
                </div>
            </div>

            <div className="flashcard-controls">
                <button onClick={handlePrev}>Previous</button>
                <span>Card {currentIndex + 1} of {flashcards.length}</span>
                <button onClick={handleNext}>Next</button>
            </div>
        </div>
    );
}