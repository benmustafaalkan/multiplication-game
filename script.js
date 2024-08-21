let playerName = "";
let currentLevel = 1;
let levelsUnlocked = JSON.parse(localStorage.getItem("levelsUnlocked")) || 1;
let playersData = JSON.parse(localStorage.getItem("playersData")) || {};

document.getElementById('start-game').onclick = function() {
    const nameInput = document.getElementById('player-name').value.trim();
    
    if (nameInput === "") {
        showError("Name cannot be empty.");
        return;
    }
    
    if (playersData[nameInput] && playersData[nameInput].completedLevel) {
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
        
        if (i <= currentLevel) {
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
    // Initialize the game for the selected level
    showQuestion();
}

function showQuestion() {
    time = 0;
    currentQuestionIndex = 1;
    document.getElementById('current-question').textContent = `Question ${currentQuestionIndex}`;
    document.getElementById('total-questions').textContent = totalQuestions;
    startTimer();
    // Generate and show the question here
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTime, 1000);
}

function updateTime() {
    time++;
    document.getElementById('timer').textContent = `Time: ${time}s`;
}

function correctAnswer() {
    score += calculateScore();
    currentQuestionIndex++;
    if (currentQuestionIndex > totalQuestions) {
        playersData[playerName].completedLevel = currentLevel;
        savePlayersData();
        levelsUnlocked++;
        localStorage.setItem("levelsUnlocked", JSON.stringify(levelsUnlocked));
        renderLevels();
    } else {
        showQuestion();
    }
}

document.getElementById('retry-btn').onclick = function() {
    document.getElementById('retry-btn').style.display = 'none';
    showQuestion();
}
