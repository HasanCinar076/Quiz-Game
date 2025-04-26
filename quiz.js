const prompt = require("prompt-sync")();
const fs = require("fs");

function loadQuestions() {
    try {
        const data = fs.readFileSync("questions.json", "utf8");
        const questions = JSON.parse(data).questions;
        return questions;
    } catch (e) {
        console.log("Error occurred while loading questions:", e);
        return [];
    }
}

function filterByCategory(questions, category) {
    return questions.filter(q => q.category === category);
}

function filterByDifficulty(questions, difficulty) {
    return questions.filter(q => q.difficulty === difficulty);
}

function shuffleAndSelect(questions, numQuestions) {
    if (numQuestions > questions.length) {
        numQuestions = questions.length;
    }
    const shuffled = questions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, numQuestions);
}

function askQuestion(question) {
    console.log(question.prompt);
    for (let i = 0; i < question.options.length; i++) {
        console.log(`${i + 1}. ${question.options[i]}`);
    }

    const startTime = Date.now();
    const choice = parseInt(prompt("Enter the number: "));
    const elapsedTime = Date.now() - startTime;

    if (elapsedTime > question.timeLimit * 1000) {
        console.log("Time's up!");
        return false;
    }

    if (isNaN(choice) || choice < 1 || choice > question.options.length) {
        console.log("Invalid choice. Please try again.");
        return false;
    }

    const selectedOption = question.options[choice - 1];
    if (selectedOption === question.answer) {
        console.log("Correct!");
        return true;
    } else {
        console.log("Incorrect. The correct answer is:", question.answer);
        return false;
    }
}

// Main program starts here
const questions = loadQuestions();

const category = prompt("Choose a category (Science, History, Math): ");
const filteredByCategory = filterByCategory(questions, category);

const difficulty = prompt("Choose a difficulty (Easy, Medium, Hard): ");
const filteredByDifficulty = filterByDifficulty(filteredByCategory, difficulty);

const numQuestions = parseInt(prompt("Enter the number of questions: "));
const selectedQuestions = shuffleAndSelect(filteredByDifficulty, numQuestions);

let correctAnswers = 0;
const startTime = Date.now();

for (let i = 0; i < selectedQuestions.length; i++) {
    console.log(`Question ${i + 1} of ${selectedQuestions.length}`);
    const isCorrect = askQuestion(selectedQuestions[i]);
    if (isCorrect) correctAnswers++;
    console.log();
}

const totalTime = Date.now() - startTime;

console.log("Quiz Complete!");
console.log("Correct Answers:", correctAnswers);
console.log("Time Taken:", Math.round(totalTime / 1000) + " seconds");
console.log("Score:", Math.round((correctAnswers / numQuestions) * 100) + "%");