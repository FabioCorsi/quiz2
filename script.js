
// script.js

const quizContainer = document.getElementById('quiz-container');
const startQuizButton = document.getElementById('start-quiz');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextQuestionButton = document.getElementById('next-question');
const resultContainer = document.getElementById('result-container');
const totalQuestionsInput = document.getElementById('total-questions');
const progressDisplay = document.getElementById('progress-display');

let questions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let totalQuestions = 0;
let selectedQuestions = [];

// Fetch questions from external JSON file
async function fetchQuestions() {
    try {
        const response = await fetch('cardiologia_quiz.json');
        questions = await response.json();
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}

// Start the quiz
function startQuiz() {
    totalQuestions = parseInt(totalQuestionsInput.value, 10);
    if (isNaN(totalQuestions) || totalQuestions <= 0 || totalQuestions > questions.length) {
        alert(`Please enter a valid number of questions (1-${questions.length}).`);
        return;
    }

    selectedQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, totalQuestions);
    currentQuestionIndex = 0;
    correctAnswers = 0;
    quizContainer.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    displayQuestion();
}

// Display a question
function displayQuestion() {
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;
    optionsContainer.innerHTML = '';

    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-button', 'btn', 'btn-outline-primary');
        button.onclick = () => handleAnswer(index);
        optionsContainer.appendChild(button);
    });

    progressDisplay.textContent = `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
}

// Handle answer selection
function handleAnswer(selectedIndex) {
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    const buttons = optionsContainer.querySelectorAll('.option-button');

    buttons.forEach((button, index) => {
        if (index === currentQuestion.correctIndex) {
            button.classList.add('btn-success');
        } else {
            button.classList.add('btn-danger');
        }
        button.disabled = true;
    });

    if (selectedIndex === currentQuestion.correctIndex) {
        correctAnswers++;
    }

    nextQuestionButton.classList.remove('hidden');
}

// Move to the next question
function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex >= totalQuestions) {
        endQuiz();
    } else {
        nextQuestionButton.classList.add('hidden');
        displayQuestion();
    }
}

// End the quiz and show results
function endQuiz() {
    quizContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    resultContainer.innerHTML = `
        <h2>Quiz Completed</h2>
        <p>You answered ${correctAnswers} out of ${totalQuestions} questions correctly.</p>
        <button class="btn btn-primary" onclick="restartQuiz()">Restart Quiz</button>
    `;
}

// Restart the quiz
function restartQuiz() {
    quizContainer.classList.add('hidden');
    resultContainer.classList.add('hidden');
    totalQuestionsInput.value = '';
}

// Initialize the quiz
startQuizButton.addEventListener('click', startQuiz);
nextQuestionButton.addEventListener('click', nextQuestion);

// Load questions on page load
fetchQuestions();
