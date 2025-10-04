import * as THREE from 'three';

export class Scene06 {
  constructor(sceneManager) {
    this.manager = sceneManager;
    this.objects = [];
    this.gameState = {
      cards: [],
      flipped: [],
      matched: [],
      canFlip: true
    };
  }

  init() {
    this.manager.threeScene.background = new THREE.Color(0x1a1a3a);
    this.createScene();
    this.startNarration();
  }

  createScene() {
    this.createStarfield();
    this.createEarth();
    this.createCharacters();
  }

  createStarfield() {
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];

    for (let i = 0; i < 300; i++) {
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.3
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    this.manager.threeScene.add(stars);
    this.objects.push(stars);
  }

  createEarth() {
    const earthGeometry = new THREE.SphereGeometry(2, 32, 32);
    const earthMaterial = new THREE.MeshStandardMaterial({
      color: 0x4488ff,
      emissive: 0x2244aa,
      emissiveIntensity: 0.3
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(0, 0, -5);

    this.manager.threeScene.add(earth);
    this.objects.push(earth);
    this.earth = earth;
  }

  createCharacters() {
    const sunGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const sunMaterial = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      emissive: 0xff6600,
      emissiveIntensity: 0.8
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(-3, 2, 0);

    this.manager.threeScene.add(sun);
    this.objects.push(sun);

    const sparkyGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const sparkyMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 1
    });
    const sparky = new THREE.Mesh(sparkyGeometry, sparkyMaterial);
    sparky.position.set(3, 2, 0);

    this.manager.threeScene.add(sparky);
    this.objects.push(sparky);
  }

  startNarration() {
    this.manager.uiManager.showSceneTitle('Scene 6: Memory Challenge!');

    setTimeout(() => {
      this.manager.uiManager.showNarration(
        "Let's test your memory! Match the aurora colors and their sounds!",
        () => {
          this.showMemoryGame();
        }
      );
    }, 3000);
  }

  showMemoryGame() {
    this.manager.uiManager.hideNarration();

    const symbols = ['🌈', '⭐', '💫', '✨', '🌟', '💥'];
    const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);

    let cardsHTML = '';
    cards.forEach((symbol, index) => {
      cardsHTML += `
        <div class="memory-card" data-index="${index}" data-symbol="${symbol}">
          <span class="card-front">?</span>
          <span class="card-back" style="display: none;">${symbol}</span>
        </div>
      `;
    });

    const gameHTML = `
      <h2>Memory Match Game</h2>
      <p>Find all the matching pairs!</p>
      <div class="memory-grid">
        ${cardsHTML}
      </div>
      <div style="text-align: center; margin-top: 15px;">
        <p id="match-counter">Matches: 0 / 6</p>
      </div>
    `;

    this.manager.uiManager.showGameUI(gameHTML);
    this.setupMemoryGame(cards);
  }

  setupMemoryGame(cards) {
    const cardElements = document.querySelectorAll('.memory-card');
    const matchCounter = document.getElementById('match-counter');

    cardElements.forEach(card => {
      card.addEventListener('click', () => {
        if (!this.gameState.canFlip) return;
        if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
        if (this.gameState.flipped.length >= 2) return;

        this.manager.audioManager.playSound('click');

        card.classList.add('flipped');
        card.querySelector('.card-front').style.display = 'none';
        card.querySelector('.card-back').style.display = 'block';

        this.gameState.flipped.push({
          element: card,
          symbol: card.dataset.symbol,
          index: card.dataset.index
        });

        if (this.gameState.flipped.length === 2) {
          this.gameState.canFlip = false;
          this.checkMatch(matchCounter);
        }
      });
    });
  }

  checkMatch(matchCounter) {
    setTimeout(() => {
      const [first, second] = this.gameState.flipped;

      if (first.symbol === second.symbol && first.index !== second.index) {
        this.manager.audioManager.playSound('success');

        first.element.classList.add('matched');
        second.element.classList.add('matched');

        this.gameState.matched.push(first.symbol);
        matchCounter.textContent = `Matches: ${this.gameState.matched.length} / 6`;

        if (this.gameState.matched.length === 6) {
          setTimeout(() => this.completeGame(), 500);
        }
      } else {
        this.manager.audioManager.playSound('boink');

        first.element.classList.remove('flipped');
        first.element.querySelector('.card-front').style.display = 'block';
        first.element.querySelector('.card-back').style.display = 'none';

        second.element.classList.remove('flipped');
        second.element.querySelector('.card-front').style.display = 'block';
        second.element.querySelector('.card-back').style.display = 'none';
      }

      this.gameState.flipped = [];
      this.gameState.canFlip = true;
    }, 800);
  }

  completeGame() {
    this.manager.audioManager.playSound('success');
    this.manager.uiManager.createConfetti();
    this.manager.uiManager.hideGameUI();

    this.manager.uiManager.showNarration(
      "Amazing! You found all the matches! Your memory is as sharp as a solar flare!",
      () => {
        this.manager.nextScene();
      }
    );
  }

  update(deltaTime) {
    if (this.earth) {
      this.earth.rotation.y += deltaTime * 0.3;
    }

    this.objects.forEach(obj => {
      if (obj.material && obj.material.emissive) {
        const intensity = obj.material.emissiveIntensity;
        obj.material.emissiveIntensity = intensity + Math.sin(Date.now() * 0.002) * 0.1;
      }
    });
  }

  cleanup() {
    this.objects.forEach(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
      this.manager.threeScene.remove(obj);
    });
    this.objects = [];
    this.manager.uiManager.hideGameUI();
    this.manager.uiManager.hideNarration();
    this.manager.uiManager.hideSceneTitle();
  }
}
