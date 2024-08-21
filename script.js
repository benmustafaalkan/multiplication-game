let score = 0;
let time = 0;
let currentQuestion = null;
let timerInterval;

function startGame() {
    resetGame();
    showQuestion();
}

function resetGame() {
    score = 0;
    time = 0;
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTime, 1000);
}

function updateTime() {
    time++;
    document.getElementById('timer').textContent = `Time: ${time}s`;
}

function showQuestion() {
    // Rastgele bir çarpım sorusu oluştur
    const num1 = Math.floor(Math.random() * 8) + 2;
    const num2 = Math.floor(Math.random() * 8) + 2;
    currentQuestion = {
        num1: num1,
        num2: num2,
        correctAnswer: num1 * num2
    };

    // Soru ve cevapları güncelle
    document.getElementById('question').textContent = `${num1} x ${num2} = ?`;
    const answerButtons = document.querySelectorAll('.answer-btn');
    const correctIndex = Math.floor(Math.random() * 4);

    answerButtons.forEach((btn, index) => {
        if (index === correctIndex) {
            btn.textContent = currentQuestion.correctAnswer;
            btn.onclick = correctAnswer;
        } else {
            btn.textContent = generateWrongAnswer(currentQuestion.correctAnswer);
            btn.onclick = wrongAnswer;
        }
    });
}

function generateWrongAnswer(correct) {
    let wrongAnswer;
    do {
        wrongAnswer = Math.floor(Math.random() * 81) + 1; // 9x9 tablosu için maksimum 81
    } while (wrongAnswer === correct);
    return wrongAnswer;
}

function correctAnswer() {
    score += calculateScore();
    document.getElementById('score').textContent = `Score: ${score}`;
    showQuestion();
}

function wrongAnswer() {
    document.getElementById('retry-btn').style.display = 'block';
}

function calculateScore() {
    if (time <= 5) return 100;
    if (time <= 10) return 80;
    if (time <= 15) return 60;
    return 40;
}

document.getElementById('retry-btn').onclick = function() {
    document.getElementById('retry-btn').style.display = 'none';
    showQuestion();
}

startGame();
