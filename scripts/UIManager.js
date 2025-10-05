export class UIManager {
  constructor(audioManager) {
    this.audioManager = audioManager;
    this.narrationBox = document.getElementById('narration-box');
    this.narrationText = document.getElementById('narration-text');
    this.nextBtn = document.getElementById('next-btn');
    this.dialogueBox = document.getElementById('dialogue-box');
    this.dialogueCharacter = document.getElementById('dialogue-character');
    this.dialogueText = document.getElementById('dialogue-text');
    this.sceneTitle = document.getElementById('scene-title');
    this.gameUI = document.getElementById('game-ui');
    this.skipBtn = document.getElementById('skip-btn');
    this.progressFill = document.getElementById('progress-fill');
    this.astronautNarrator = document.getElementById('astronaut-narrator');
    this.astronautSpeech = document.getElementById('astronaut-speech');
    this.sceneIndicator = document.getElementById('scene-indicator');

    this.subtitlesEnabled = true;
    this.onNextCallback = null;
    this.setupButtons();
  }

  setupButtons() {
    this.nextBtn.addEventListener('click', () => {
      this.audioManager.playSound('click');
      if (this.onNextCallback) {
        this.onNextCallback();
      }
    });

    this.skipBtn.addEventListener('click', () => {
      this.audioManager.playSound('click');
      this.audioManager.stopSpeaking();
      if (this.onNextCallback) {
        this.onNextCallback();
      }
    });
  }

  showNarration(text, onNext) {
    this.narrationText.textContent = text;
    this.narrationBox.classList.remove('hidden');
    this.skipBtn.classList.remove('hidden');
    this.onNextCallback = onNext;

    this.audioManager.speak(text, () => {
      this.nextBtn.style.animation = 'bounce 0.5s ease infinite';
    });
  }

  hideNarration() {
    this.narrationBox.classList.add('hidden');
    this.skipBtn.classList.add('hidden');
    this.audioManager.stopSpeaking();
    this.nextBtn.style.animation = '';
  }

  showDialogue(character, text, duration = 3000) {
    this.dialogueCharacter.textContent = character;
    this.dialogueText.textContent = text;
    this.dialogueBox.classList.remove('hidden');

    this.audioManager.speak(text);

    setTimeout(() => {
      this.hideDialogue();
    }, duration);
  }

  hideDialogue() {
    this.dialogueBox.classList.add('hidden');
  }

  showSceneTitle(title, duration = 3000) {
    this.sceneTitle.textContent = title;
    this.sceneTitle.classList.remove('hidden');

    setTimeout(() => {
      this.hideSceneTitle();
    }, duration);
  }

  hideSceneTitle() {
    this.sceneTitle.classList.add('hidden');
  }

  showGameUI(content) {
    this.gameUI.innerHTML = content;
    this.gameUI.classList.remove('hidden');
  }

  hideGameUI() {
    this.gameUI.classList.add('hidden');
    this.gameUI.innerHTML = '';
  }

  updateProgress(percentage) {
    this.progressFill.style.width = `${percentage}%`;
  }

  showAstronautNarrator(text, duration = 3000) {
    this.astronautNarrator.classList.remove('hidden');
    this.astronautSpeech.classList.remove('hidden');
    this.astronautSpeech.textContent = text;

    this.audioManager.speak(text);

    if (duration > 0) {
      setTimeout(() => {
        this.hideAstronautNarrator();
      }, duration);
    }
  }

  hideAstronautNarrator() {
    this.astronautSpeech.classList.add('hidden');
  }

  updateSceneIndicator(current, total) {
    this.sceneIndicator.textContent = `Scene ${current}/${total}`;
  }

  createConfetti() {
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = ['#ffd700', '#ff6b6b', '#00d9ff', '#48dbfb', '#feca57'][Math.floor(Math.random() * 5)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        document.getElementById('ui-overlay').appendChild(confetti);

        setTimeout(() => confetti.remove(), 3000);
      }, i * 20);
    }
  }
}
