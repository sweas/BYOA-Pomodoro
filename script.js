let timeLeft;
let timerId = null;
let isWorkMode = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const workButton = document.getElementById('work');
const breakButton = document.getElementById('break');
const modeToggle = document.getElementById('modeToggle');

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

const startSound = new Audio('https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-112294/zapsplat_multimedia_game_sound_blip_throw_item_112550.mp3');
const stopSound = new Audio('https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-112294/zapsplat_multimedia_game_sound_blip_throw_item_112550.mp3');
const completeSound = new Audio('https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-112294/zapsplat_multimedia_game_sound_blip_throw_item_112550.mp3');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update the display in the DOM
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    // Update the page title
    const mode = isWorkMode ? 'Focus' : 'Break';
    document.title = `(${timeString}) ${mode} - Focus Timer`;
}

function updateGradient() {
    if (timerId === null) return; // Don't update gradient when timer is stopped
    
    const totalTime = isWorkMode ? WORK_TIME : BREAK_TIME;
    const progress = 1 - (timeLeft / totalTime);
    
    if (isWorkMode) {
        document.documentElement.style.setProperty('--work-opacity', 1 - progress);
        document.documentElement.style.setProperty('--break-opacity', progress);
    } else {
        document.documentElement.style.setProperty('--work-opacity', progress);
        document.documentElement.style.setProperty('--break-opacity', 1 - progress);
    }
}

function startTimer() {
    if (timerId !== null) {
        stopSound.play();
        clearInterval(timerId);
        startButton.textContent = 'Start';
        timerId = null;
        return;
    }

    startSound.play();
    startButton.textContent = 'Pause';
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        updateGradient();

        if (timeLeft === 0) {
            completeSound.play();
            clearInterval(timerId);
            timerId = null;
            startButton.textContent = 'Start';
            alert(isWorkMode ? 'Work session completed! Take a break!' : 'Break is over! Back to work!');
            switchMode();
            startTimer();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    timeLeft = isWorkMode ? WORK_TIME : BREAK_TIME;
    updateDisplay();
    startButton.textContent = 'Start';
}

function switchMode() {
    isWorkMode = !isWorkMode;
    document.body.classList.toggle('break-mode', !isWorkMode);
    timeLeft = isWorkMode ? WORK_TIME : BREAK_TIME;
    updateDisplay();
    
    // Set initial gradient state based on the new mode
    if (isWorkMode) {
        document.documentElement.style.setProperty('--work-opacity', 1);
        document.documentElement.style.setProperty('--break-opacity', 0);
    } else {
        document.documentElement.style.setProperty('--work-opacity', 0);
        document.documentElement.style.setProperty('--break-opacity', 1);
    }
}

// Initialize
timeLeft = WORK_TIME;
updateDisplay();
document.body.classList.toggle('break-mode', !isWorkMode);
updateGradient();

// Event listeners
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
modeToggle.addEventListener('change', () => {
    if (isWorkMode !== !modeToggle.checked) {
        switchMode();
    }
}); 