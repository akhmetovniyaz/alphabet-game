// Game data: items with their emoji, name, and correct letter
const gameItems = [
    { emoji: '🍎', name: 'Apple', letter: 'A' },
    { emoji: '🎈', name: 'Balloon', letter: 'B' },
    { emoji: '🐱', name: 'Cat', letter: 'C' },
    { emoji: '🐕', name: 'Dog', letter: 'D' },
    { emoji: '🐘', name: 'Elephant', letter: 'E' },
    { emoji: '🐸', name: 'Frog', letter: 'F' },
    { emoji: '🍇', name: 'Grapes', letter: 'G' },
    { emoji: '🏠', name: 'House', letter: 'H' },
    { emoji: '🍦', name: 'Ice Cream', letter: 'I' },
    { emoji: '🃏', name: 'Joker', letter: 'J' },
    { emoji: '🔑', name: 'Key', letter: 'K' },
    { emoji: '🦁', name: 'Lion', letter: 'L' },
    { emoji: '🐵', name: 'Monkey', letter: 'M' },
    { emoji: '🥜', name: 'Nut', letter: 'N' },
    { emoji: '🐙', name: 'Octopus', letter: 'O' },
    { emoji: '🍕', name: 'Pizza', letter: 'P' },
    { emoji: '👑', name: 'Queen', letter: 'Q' },
    { emoji: '🚀', name: 'Rocket', letter: 'R' },
    { emoji: '⭐', name: 'Star', letter: 'S' },
    { emoji: '🐯', name: 'Tiger', letter: 'T' },
    { emoji: '☂️', name: 'Umbrella', letter: 'U' },
    { emoji: '🎻', name: 'Violin', letter: 'V' },
    { emoji: '🍉', name: 'Watermelon', letter: 'W' },
    { emoji: '🎄', name: 'Xmas Tree', letter: 'X' },
    { emoji: '🧶', name: 'Yarn', letter: 'Y' },
    { emoji: '🦓', name: 'Zebra', letter: 'Z' }
];

// Game state
let currentItem = null;
let correctScore = 0;
let incorrectScore = 0;
let usedItems = [];

// DOM elements
const itemImageElement = document.getElementById('item-image');
const itemNameElement = document.getElementById('item-name');
const optionsContainer = document.getElementById('options-container');
const feedbackElement = document.getElementById('feedback');
const feedbackText = document.getElementById('feedback-text');
const nextButton = document.getElementById('next-button');
const correctScoreElement = document.getElementById('correct-score');
const incorrectScoreElement = document.getElementById('incorrect-score');
const resetButton = document.getElementById('reset-button');

// Initialize the game
function initGame() {
    loadScores();
    updateScoreDisplay();
    loadNewItem();
}

// Load scores from LocalStorage
function loadScores() {
    const savedCorrect = localStorage.getItem('alphabetGameCorrect');
    const savedIncorrect = localStorage.getItem('alphabetGameIncorrect');
    
    if (savedCorrect !== null) {
        correctScore = parseInt(savedCorrect, 10);
    }
    
    if (savedIncorrect !== null) {
        incorrectScore = parseInt(savedIncorrect, 10);
    }
}

// Save scores to LocalStorage
function saveScores() {
    localStorage.setItem('alphabetGameCorrect', correctScore);
    localStorage.setItem('alphabetGameIncorrect', incorrectScore);
}

// Update score display
function updateScoreDisplay() {
    correctScoreElement.textContent = correctScore;
    incorrectScoreElement.textContent = incorrectScore;
}

// Load a new item for the game
function loadNewItem() {
    // Reset feedback and next button
    feedbackElement.classList.add('hidden');
    feedbackElement.classList.remove('correct', 'incorrect');
    nextButton.classList.add('hidden');
    itemNameElement.textContent = '';

    // If all items have been used, reset the used items list
    if (usedItems.length === gameItems.length) {
        usedItems = [];
    }

    // Get available items
    const availableItems = gameItems.filter(item => !usedItems.includes(item));

    // Select a random item
    const randomIndex = Math.floor(Math.random() * availableItems.length);
    currentItem = availableItems[randomIndex];
    usedItems.push(currentItem);

    // Display the item
    itemImageElement.textContent = currentItem.emoji;

    // Generate options
    generateOptions();
}

// Generate letter options
function generateOptions() {
    optionsContainer.innerHTML = '';

    // Get the correct letter
    const correctLetter = currentItem.letter;

    // Generate 3 random wrong letters
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const wrongLetters = [];

    while (wrongLetters.length < 3) {
        const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
        if (randomLetter !== correctLetter && !wrongLetters.includes(randomLetter)) {
            wrongLetters.push(randomLetter);
        }
    }

    // Combine and shuffle options
    const options = [correctLetter, ...wrongLetters];
    options.sort(() => Math.random() - 0.5);

    // Create option buttons
    options.forEach(letter => {
        const button = document.createElement('button');
        button.classList.add('option-button');
        button.textContent = letter;
        button.addEventListener('click', () => checkAnswer(letter, button));
        optionsContainer.appendChild(button);
    });
}

// Check the selected answer
function checkAnswer(selectedLetter, button) {
    // Disable all buttons
    const allButtons = document.querySelectorAll('.option-button');
    allButtons.forEach(btn => btn.disabled = true);

    if (selectedLetter === currentItem.letter) {
        // Correct answer
        button.classList.add('correct');
        feedbackElement.classList.remove('hidden', 'incorrect');
        feedbackElement.classList.add('correct');
        feedbackText.textContent = `🎉 Правильно! Это "${currentItem.name}"`;
        
        // Update score
        correctScore++;
        updateScoreDisplay();
        saveScores();

        // Show item name
        itemNameElement.textContent = currentItem.name;

        // Play pronunciation
        speakLetter(currentItem.letter, currentItem.name);
    } else {
        // Incorrect answer
        button.classList.add('incorrect');
        feedbackElement.classList.remove('hidden', 'correct');
        feedbackElement.classList.add('incorrect');
        feedbackText.textContent = `❌ Неправильно! Правильный ответ: ${currentItem.letter}`;
        
        // Update score
        incorrectScore++;
        updateScoreDisplay();
        saveScores();

        // Show item name
        itemNameElement.textContent = currentItem.name;

        // Highlight correct answer
        allButtons.forEach(btn => {
            if (btn.textContent === currentItem.letter) {
                btn.classList.add('correct');
            }
        });
    }

    // Show next button
    nextButton.classList.remove('hidden');
}

// Speak the letter and word using Web Speech API
function speakLetter(letter, word) {
    if ('speechSynthesis' in window) {
        // Speak the letter
        const letterUtterance = new SpeechSynthesisUtterance(letter);
        letterUtterance.lang = 'en-US';
        letterUtterance.rate = 0.8;
        
        // Speak the word
        const wordUtterance = new SpeechSynthesisUtterance(word);
        wordUtterance.lang = 'en-US';
        wordUtterance.rate = 0.8;

        // Speak letter first, then word
        speechSynthesis.speak(letterUtterance);
        
        letterUtterance.onend = () => {
            setTimeout(() => {
                speechSynthesis.speak(wordUtterance);
            }, 300);
        };
    }
}

// Reset scores
function resetScores() {
    if (confirm('Вы уверены, что хотите сбросить счёт?')) {
        correctScore = 0;
        incorrectScore = 0;
        usedItems = [];
        updateScoreDisplay();
        saveScores();
        loadNewItem();
    }
}

// Event listeners
nextButton.addEventListener('click', loadNewItem);
resetButton.addEventListener('click', resetScores);

// Start the game when page loads
document.addEventListener('DOMContentLoaded', initGame);
