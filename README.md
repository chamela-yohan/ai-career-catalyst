# AI Career Catalyst 🚀

**AI Career Catalyst** is a modern, full-stack web application designed to help job seekers prepare for technical interviews. By leveraging the power of **Google Gemini AI**, the platform generates role-specific interview questions and professional model answers to streamline the career preparation process.

---

## ✨ Features

* **AI Interview Question Generator:** Dynamically generates top 5 interview questions based on the user's job role and experience level.
* **Model Answer Retrieval:** Provides concise, industry-standard answers for each generated question using AI.
* **Modern UI/UX:** Clean, dark-themed responsive interface built with React and Vite.
* **Dockerized Environment:** Fully containerized setup for easy development and deployment.
* **Scalable Backend:** Robust API built with Django and Django Rest Framework (DRF).

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js (Vite), Axios, CSS3 |
| **Backend** | Django, Django Rest Framework (DRF) |
| **Database** | MySQL |
| **AI Engine** | Google Gemini 2.5 Flash API |
| **DevOps** | Docker, Docker Compose |
| **Version Control** | Git & GitHub |

---

## 🚀 Getting Started

Follow these steps to get the project up and running on your local machine using Docker.

### Prerequisites
* [Docker](https://www.docker.com/) installed on your machine.
* Google Gemini API Key (Get it from [Google AI Studio](https://aistudio.google.com/)).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/chamela-yohan/ai-career-catalyst.git](https://github.com/chamela-yohan/ai-career-catalyst.git)
    cd ai-career-catalyst
    ```

2.  **Environment Setup:**
    Open `docker-compose.yml` and replace `YOUR_GEMINI_API_KEY` with your actual API key.

3.  **Build and Run with Docker:**
    ```bash
    docker-compose up --build
    ```

4.  **Run Migrations:**
    Open a new terminal and run:
    ```bash
    docker-compose run web python manage.py migrate
    ```

5.  **Access the App:**
    * Frontend: `http://localhost:5173`
    * Backend API: `http://localhost:8000/api/`

---

## 📈 Roadmap

- [x] Initial Project Setup (Docker, Django, React)
- [x] Basic AI Integration (Gemini API)
- [x] Interview Question Generator Feature
- [ ] User Authentication (Firebase/JWT) - **In Progress**
- [ ] MySQL Database Integration for Saving History
- [ ] Resume Analysis & Feedback
- [ ] Mock Interview Voice Support

---

## 👤 Author

**Chamela Yohan**
* GitHub: [@chamela-yohan](https://github.com/chamela-yohan)
* LinkedIn: https://www.linkedin.com/in/chamela-aththanayaka-a28865228/
