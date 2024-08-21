let playerName = "";
let currentLevel = 1;
let levelsUnlocked = JSON.parse(localStorage.getItem("levelsUnlocked")) || 1;
let playersData = JSON.parse(localStorage.getItem("playersData")) || {};
let score = 0;
let time = 0;
let currentQuestionIndex = 1;
let totalQuestions = 25;
let timerInterval;

document.getElementById('start-game').onclick = function() {
    const nameInput = document.getElementById('player-name').value.trim();
    
    if (nameInput === "") {
        showError("Name cannot be empty.");
        return;
    }
    
    if (playersData[nameInput]) {
        playerName = nameInput;
        currentLevel = playersData[nameInput].completedLevel + 1;
    } else if (!playersData[nameInput]) {
        playerName = nameInput;
        playersData[playerName] = { completedLevel: 0 };
    } else {
        showError("This name is already taken. Please choose another.");
        return;
    }

    savePlayersData();
    document.getElementById('user-name-display').textContent = `Welcome, ${playerName}!`;
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('level-selection').style.display = 'block';
    renderLevels();
};

function showError(message) {
    const errorElement = document.getElementById('name-error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function savePlayersData() {
    localStorage.setItem("playersData", JSON.stringify(playersData));
}

function renderLevels() {
    const levelsContainer = document.getElementById('levels');
    levelsContainer.innerHTML = '';
    const totalLevels = 10;

    for (let i = 1; i <= totalLevels; i++) {
        const levelButton = document.createElement('button');
        levelButton.textContent = `Level ${i}`;
        
        if (i <= levelsUnlocked) {
            levelButton.onclick = function() {
                startGame(i);
            };
        } else {
            levelButton.disabled = true;
            levelButton.classList.add('locked');
        }

        levelsContainer.appendChild(levelButton);
    }
}

function startGame(level) {
    document.getElementById('level-selection').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    currentLevel = level;
    score = 0;
    time = 0;
    currentQuestionIndex = 1;
    updateScoreAndTime();
    showQuestion();
}

function showQuestion() {
    // Rastgele bir çarpım sorusu oluştur
    const num1 = Math.floor(Math.random() * 9) + 1;  // 1 ile 9 arasında bir sayı
    const num2 = Math.floor(Math.random() * 9) + 1;  // 1 ile 9 arasında bir sayı
    const correctAnswer = num1 * num2;

    document.getElementById('question').textContent = `${num1} x ${num2}`;

    // Cevap butonlarını oluşturma
    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';  // Mevcut cevapları temizle

    const correctButton = document.createElement('button');
    correctButton.textContent = correctAnswer;
    correctButton.onclick = correctAnswerHandler;
    answersContainer.appendChild(correctButton);

    for (let i = 0; i < 3; i++) {
        const wrongAnswer = generateWrongAnswer(correctAnswer);
        const wrongButton = document.createElement('button');
        wrongButton.textContent = wrongAnswer;
        wrongButton.onclick = wrongAnswerHandler;
        answersContainer.appendChild(wrongButton);
    }

    shuffleAnswers(answersContainer);  // Cevapları karıştırma
    resetTimer();
    startTimer();
}

function generateWrongAnswer(correctAnswer) {
    let wrongAnswer;
    do {
        wrongAnswer = Math.floor(Math.random() * 81) + 1;  // 1 ile 81 arasında yanlış cevap
    } while (wrongAnswer === correctAnswer);
    return wrongAnswer;
}

function correctAnswerHandler() {
    score += calculateScore();
    updateScoreAndTime();
    currentQuestionIndex++;
    
    if (currentQuestionIndex > totalQuestions) {
        finishLevel();
    } else {
        showQuestion();
    }
}

function wrongAnswerHandler() {
    alert('Try again!');
}

function shuffleAnswers(container) {
    for (let i = container.children.length; i >= 0; i--) {
        container.appendChild(container.children[Math.random() * i | 0]);
    }
}

function calculateScore() {
    if (time <= 5) return 100;
    if (time <= 10) return 80;
    if (time <= 15) return 60;
    return 40;
}

function updateScoreAndTime() {
    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('current-question').textContent = `Question ${currentQuestionIndex}`;
}

function resetTimer() {
    time = 0;
    document.getElementById('timer').textContent = `Time: 0s`;
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTime, 1000);
}

function updateTime() {
    time++;
    document.getElementById('timer').textContent = `Time: ${time}s`;
}

function finishLevel() {
    clearInterval(timerInterval);
    playersData[playerName].completedLevel = currentLevel;
    savePlayersData();
    levelsUnlocked++;
    localStorage.setItem("levelsUnlocked", JSON.stringify(levelsUnlocked));
    alert('Level Completed!');
    document.getElementById('game-screen').style.display = 'none';
    renderLevels();
    document.getElementById('level-selection').style.display = 'block';
}

document.getElementById('retry-btn').onclick = function() {
    document.getElementById('retry-btn').style.display = 'none';
    showQuestion();
}

// Exit button functionality to go back to level selection
document.getElementById('exit-btn').onclick = function() {
    clearInterval(timerInterval);
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('level-selection').style.display = 'block';
    renderLevels();
}
