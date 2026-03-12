import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const askAI = async (prompt) => {
    try {
        const response = await axios.post(`${API_URL}/test-ai/`, { prompt });
        return response.data;
    } catch (error) {
        console.error("Error connecting to AI Backend", error);
        throw error;
    }
};

// ප්‍රශ්න ගන්න
export const generateQuestions = async (jobRole, experience) => {
    const response = await axios.post(`${API_URL}/generate-questions/`, { 
        job_role: jobRole, 
        experience: experience 
    });
    return response.data.questions;
};

// පිළිතුරක් ලබා ගැනීමට (test-ai එකම ගත්තා වැඩේට :))
export const getModelAnswer = async (question) => {
    const prompt = `Give a professional and concise interview answer for this question: ${question}`;
    const response = await axios.post(`${API_URL}/test-ai/`, { prompt });
    return response.data.ai_response;
};