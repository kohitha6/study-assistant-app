import React, { useState, useRef } from 'react';
import InputForm from './components/InputForm';
import FlashcardViewer from './components/FlashcardViewer';
import QuizTaker from './components/QuizTaker';
import { parseStudyResponse } from './utils/parser';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [studyData, setStudyData] = useState(null);
    const [activeTab, setActiveTab] = useState('flashcards');

    // Stale response guard reference
    const latestRequestId = useRef(0);

    const handleGenerate = async (topic) => {
        const currentRequestId = ++latestRequestId.current;
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/api/generate-study-material`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic })
            });

            if (!response.ok) {
                let errorMessage = `Server error: ${response.statusText}`;
                try {
                    const errorBody = await response.json();
                    errorMessage = errorBody.details || errorBody.error || errorMessage;
                } catch {
                    // Keep the HTTP status message when the server response is not JSON.
                }
                throw new Error(errorMessage);
            }

            const json = await response.json();

            // Ignore stale responses if a newer request was dispatched
            if (currentRequestId !== latestRequestId.current) {
                return;
            }

            const validatedData = parseStudyResponse(json.data);
            setStudyData(validatedData);
        } catch (err) {
            if (currentRequestId === latestRequestId.current) {
                setError(err.message || 'An unexpected error occurred.');
            }
        } finally {
            if (currentRequestId === latestRequestId.current) {
                setLoading(false);
            }
        }
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>AI Study Assistant</h1>
                <p>Turn your notes into interactive flashcards and quizzes</p>
            </header>

            <main>
                <InputForm onSubmit={handleGenerate} isLoading={loading} />

                {loading && <div className="loading-spinner">Generating study material...</div>}

                {error && (
                    <div className="error-banner">
                        <p><strong>Error:</strong> {error}</p>
                        <button onClick={() => setError(null)}>Dismiss</button>
                    </div>
                )}

                {studyData && !loading && (
                    <div className="study-workspace">
                        <div className="workspace-tabs">
                            <button 
                                className={activeTab === 'flashcards' ? 'active' : ''} 
                                onClick={() => setActiveTab('flashcards')}
                            >
                                Flashcards ({studyData.flashcards.length})
                            </button>
                            <button 
                                className={activeTab === 'quiz' ? 'active' : ''} 
                                onClick={() => setActiveTab('quiz')}
                            >
                                Quiz ({studyData.quiz.length})
                            </button>
                        </div>

                        {activeTab === 'flashcards' && <FlashcardViewer flashcards={studyData.flashcards} />}
                        {activeTab === 'quiz' && <QuizTaker quiz={studyData.quiz} />}
                    </div>
                )}
            </main>
        </div>
    );
}