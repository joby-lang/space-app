import * as THREE from 'three';

export class Scene05 {
  constructor(sceneManager) {
    this.manager = sceneManager;
    this.objects = [];
    this.sunny = null;
    this.sparky = null;
  }

  init() {
    this.manager.threeScene.background = new THREE.Color(0x1a1a3a);
    this.createScene();
    this.startNarration();
  }

  createScene() {
    this.createStarfield();
    this.createSunny();
    this.createSparky();
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

  createSunny() {
    const sunnyGroup = new THREE.Group();

    const sunGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const sunMaterial = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      emissive: 0xff6600,
      emissiveIntensity: 0.8
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sunnyGroup.add(sun);

    const eyeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.4, 0.4, 1.4);
    sunnyGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.4, 0.4, 1.4);
    sunnyGroup.add(rightEye);

    const smileGeometry = new THREE.TorusGeometry(0.4, 0.08, 16, 50, Math.PI);
    const smileMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const smile = new THREE.Mesh(smileGeometry, smileMaterial);
    smile.position.set(0, 0, 1.4);
    smile.rotation.x = Math.PI;
    sunnyGroup.add(smile);

    sunnyGroup.position.set(-3, 1, 0);
    sunnyGroup.userData.bounceOffset = 0;

    this.manager.threeScene.add(sunnyGroup);
    this.objects.push(sunnyGroup);
    this.sunny = sunnyGroup;
  }

  createSparky() {
    const sparkyGroup = new THREE.Group();

    const sparkyGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const sparkyMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 1
    });
    const spark = new THREE.Mesh(sparkyGeometry, sparkyMaterial);
    sparkyGroup.add(spark);

    const eyeGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.2, 0.1, 0.7);
    sparkyGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.2, 0.1, 0.7);
    sparkyGroup.add(rightEye);

    const glowGeometry = new THREE.SphereGeometry(1, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.3
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    sparkyGroup.add(glow);

    sparkyGroup.position.set(3, 1, 0);
    sparkyGroup.userData.sparkleOffset = 0;

    this.manager.threeScene.add(sparkyGroup);
    this.objects.push(sparkyGroup);
    this.sparky = sparkyGroup;
  }

  startNarration() {
    this.manager.uiManager.showSceneTitle('Scene 5: Learning Time!');

    setTimeout(() => {
      this.manager.uiManager.showNarration(
        "Sunny and Sparky want to teach you some cool space weather terms!",
        () => {
          this.showDefinitionsGame();
        }
      );
    }, 3000);
  }

  showDefinitionsGame() {
    this.manager.uiManager.hideNarration();

    const gameHTML = `
      <h2>Space Weather Dictionary</h2>
      <p>Tap each term to learn what it means!</p>
      <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 20px;">
        <button class="icon-button" data-term="solar-flare">☀️ Solar Flare</button>
        <button class="icon-button" data-term="aurora">🌈 Aurora</button>
        <button class="icon-button" data-term="magnetosphere">🛡️ Magnetosphere</button>
      </div>
      <div id="definition-display" style="margin-top: 20px;"></div>
      <div style="text-align: center; margin-top: 20px;">
        <button class="next-button" id="continue-btn">Continue Adventure</button>
      </div>
    `;

    this.manager.uiManager.showGameUI(gameHTML);
    this.setupDefinitionsGame();
  }

  setupDefinitionsGame() {
    const definitions = {
      'solar-flare': {
        title: 'Solar Flare',
        text: 'A solar flare is a sudden burst of energy from the Sun. It sends out light, heat, and particles into space. Sometimes these particles travel all the way to Earth!'
      },
      'aurora': {
        title: 'Aurora',
        text: 'Auroras are beautiful colored lights in the sky, usually seen near the North and South Poles. They happen when solar particles hit gases in Earth\'s atmosphere. They can be green, pink, purple, or red!'
      },
      'magnetosphere': {
        title: 'Magnetosphere',
        text: 'The magnetosphere is like Earth\'s invisible shield! It\'s a magnetic field that protects us from harmful solar particles. It acts like a superhero cape for our planet!'
      }
    };

    const buttons = document.querySelectorAll('[data-term]');
    const display = document.getElementById('definition-display');

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        this.manager.audioManager.playSound('click');
        const term = button.dataset.term;
        const def = definitions[term];

        display.innerHTML = `
          <div class="definition-panel">
            <h3>${def.title}</h3>
            <p>${def.text}</p>
          </div>
        `;

        this.manager.audioManager.speak(def.text);
      });
    });

    document.getElementById('continue-btn').addEventListener('click', () => {
      this.manager.audioManager.playSound('success');
      this.completeScene();
    });
  }

  completeScene() {
    this.manager.uiManager.hideGameUI();

    this.manager.uiManager.showNarration(
      "Great learning! Now you know all about space weather. Let's continue our adventure!",
      () => {
        this.manager.nextScene();
      }
    );
  }

  update(deltaTime) {
    if (this.sunny) {
      this.sunny.userData.bounceOffset += deltaTime * 2;
      this.sunny.position.y = 1 + Math.sin(this.sunny.userData.bounceOffset) * 0.3;
      this.sunny.rotation.y += deltaTime * 0.5;
    }

    if (this.sparky) {
      this.sparky.userData.sparkleOffset += deltaTime * 3;
      this.sparky.position.y = 1 + Math.cos(this.sparky.userData.sparkleOffset) * 0.3;
      this.sparky.rotation.y -= deltaTime * 0.5;

      const glow = this.sparky.children.find(child =>
        child.material && child.material.transparent
      );
      if (glow) {
        glow.scale.setScalar(1 + Math.sin(this.sparky.userData.sparkleOffset * 2) * 0.2);
      }
    }
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
