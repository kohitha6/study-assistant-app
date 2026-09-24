import React, { useState } from 'react';

export default function InputForm({ onSubmit, isLoading }) {
    const [topic, setTopic] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!topic.trim()) return;
        onSubmit(topic);
    };

    return (
        <form className="input-form" onSubmit={handleSubmit}>
            <textarea
                rows="4"
                placeholder="Paste your study notes or type a topic (e.g., React Hooks, Photosynthesis, World War II)..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !topic.trim()}>
                {isLoading ? 'Processing...' : 'Generate Study Material'}
            </button>
        </form>
    );
}