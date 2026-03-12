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