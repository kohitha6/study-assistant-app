export function parseStudyResponse(rawInput) {
    let parsedData;
    try {
        if (typeof rawInput === 'string') {
            const cleaned = rawInput.replace(/```json/g, '').replace(/```/g, '').trim();
            parsedData = JSON.parse(cleaned);
        } else {
            parsedData = rawInput;
        }
    } catch (err) {
        throw new Error('Malformed JSON received from AI model.');
    }

    if (!parsedData || typeof parsedData !== 'object') {
        throw new Error('Invalid response shape: Root must be an object.');
    }

    const flashcards = Array.isArray(parsedData.flashcards)
        ? parsedData.flashcards.map((fc, index) => ({
            id: String(fc.id || index + 1),
            front: String(fc.front || 'Untitled Front'),
            back: String(fc.back || 'Untitled Back')
          }))
        : [];

    const quiz = Array.isArray(parsedData.quiz)
        ? parsedData.quiz.map((q, index) => ({
            id: String(q.id || `q${index + 1}`),
            question: String(q.question || 'Untitled Question'),
            options: Array.isArray(q.options) ? q.options.map(String) : ['A', 'B', 'C', 'D'],
            answer: String(q.answer || '')
          }))
        : [];

    if (flashcards.length === 0 && quiz.length === 0) {
        throw new Error('Response shape error: Flashcards and quiz arrays are empty.');
    }

    return { flashcards, quiz };
}