import * as THREE from 'three';

export class Scene08 {
  constructor(sceneManager) {
    this.manager = sceneManager;
    this.objects = [];
    this.fixedSystems = 0;
  }

  init() {
    this.manager.threeScene.background = new THREE.Color(0x1a2f4a);
    this.createScene();
    this.startNarration();
  }

  createScene() {
    this.createSky();
    this.createGround();
    this.createFarm();
    this.createTown();
    this.createCharacters();
  }

  createSky() {
    const skyColors = [
      new THREE.Color(0x87ceeb),
      new THREE.Color(0xffa500),
      new THREE.Color(0xff6b9d)
    ];

    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.PlaneGeometry(40, 15);
      const material = new THREE.MeshBasicMaterial({
        color: skyColors[i],
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      const sky = new THREE.Mesh(geometry, material);
      sky.position.set(0, 5 + i * 3, -15);
      this.manager.threeScene.add(sky);
      this.objects.push(sky);
    }
  }

  createGround() {
    const groundGeometry = new THREE.PlaneGeometry(30, 30);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x3a5f4a });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -3;
    this.manager.threeScene.add(ground);
    this.objects.push(ground);
  }

  createFarm() {
    const tractorGroup = new THREE.Group();

    const bodyGeometry = new THREE.BoxGeometry(1.2, 0.6, 1.5);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.3;
    tractorGroup.add(body);

    const wheelGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.15, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });

    const positions = [
      [-0.5, -0.05, 0.6],
      [0.5, -0.05, 0.6],
      [-0.5, -0.05, -0.6],
      [0.5, -0.05, -0.6]
    ];

    positions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(pos[0], pos[1], pos[2]);
      tractorGroup.add(wheel);
    });

    tractorGroup.position.set(-5, -2, 0);
    this.manager.threeScene.add(tractorGroup);
    this.objects.push(tractorGroup);
    this.tractor = tractorGroup;
  }

  createTown() {
    const poleGeometry = new THREE.CylinderGeometry(0.08, 0.08, 2.5, 8);
    const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

    for (let i = 0; i < 4; i++) {
      const pole = new THREE.Mesh(poleGeometry, poleMaterial);
      pole.position.set(2 + i * 1.5, -1, -2);
      this.manager.threeScene.add(pole);
      this.objects.push(pole);
    }

    const houseGeometry = new THREE.BoxGeometry(2, 2, 2);
    const houseMaterial = new THREE.MeshStandardMaterial({ color: 0xaa6644 });
    const house = new THREE.Mesh(houseGeometry, houseMaterial);
    house.position.set(5, -1, 2);
    this.manager.threeScene.add(house);
    this.objects.push(house);

    const roofGeometry = new THREE.ConeGeometry(1.5, 1, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x8b0000 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(5, 1, 2);
    roof.rotation.y = Math.PI / 4;
    this.manager.threeScene.add(roof);
    this.objects.push(roof);
  }

  createCharacters() {
    const sunGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const sunMaterial = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      emissive: 0xff6600,
      emissiveIntensity: 0.8
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(-8, 3, -5);

    const eyeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-8.4, 3.4, -3.6);
    this.manager.threeScene.add(leftEye);
    this.objects.push(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(-7.6, 3.4, -3.6);
    this.manager.threeScene.add(rightEye);
    this.objects.push(rightEye);

    this.manager.threeScene.add(sun);
    this.objects.push(sun);
    this.sun = sun;

    const sparkyGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const sparkyMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 1
    });
    const sparky = new THREE.Mesh(sparkyGeometry, sparkyMaterial);
    sparky.position.set(8, 3, -5);
    this.manager.threeScene.add(sparky);
    this.objects.push(sparky);
    this.sparky = sparky;

    const earthGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const earthMaterial = new THREE.MeshStandardMaterial({
      color: 0x4488ff,
      emissive: 0x2244aa,
      emissiveIntensity: 0.3
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(0, 2, -3);
    this.manager.threeScene.add(earth);
    this.objects.push(earth);
    this.earth = earth;

    for (let i = 0; i < 5; i++) {
      const childGroup = new THREE.Group();

      const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
      const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffccaa });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.y = 0.5;
      childGroup.add(head);

      const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 8);
      const colors = [0xff6666, 0x66ff66, 0x6666ff, 0xffff66, 0xff66ff];
      const bodyMaterial = new THREE.MeshStandardMaterial({ color: colors[i] });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      childGroup.add(body);

      childGroup.position.set((i - 2) * 1.2, -2, 1);
      this.manager.threeScene.add(childGroup);
      this.objects.push(childGroup);
    }
  }

  startNarration() {
    this.manager.uiManager.showSceneTitle('Scene 8: Everyone\'s Day');

    setTimeout(() => {
      this.manager.uiManager.showNarration(
        "After all the adventures, everyone is working together to make sure everything is running smoothly!",
        () => {
          this.manager.uiManager.showNarration(
            "Help restore the last power line to complete the repairs!",
            () => {
              this.showRestorationGame();
            }
          );
        }
      );
    }, 3000);
  }

  showRestorationGame() {
    this.manager.uiManager.hideNarration();

    const gameHTML = `
      <h2>Final Restoration!</h2>
      <p>Tap each system to restore it!</p>
      <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 20px;">
        <button class="icon-button system-btn" data-system="tractor">🚜 Restore Tractor GPS</button>
        <button class="icon-button system-btn" data-system="power">⚡ Restore Power Lines</button>
        <button class="icon-button system-btn" data-system="radio">📻 Restore Radio Signals</button>
        <button class="icon-button system-btn" data-system="satellite">🛰️ Restore Satellite</button>
      </div>
      <p id="restoration-progress" style="text-align: center; margin-top: 15px; font-size: 18px;">Systems restored: 0 / 4</p>
    `;

    this.manager.uiManager.showGameUI(gameHTML);
    this.setupRestorationGame();
  }

  setupRestorationGame() {
    const buttons = document.querySelectorAll('.system-btn');
    const progress = document.getElementById('restoration-progress');

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        if (button.classList.contains('restored')) return;

        this.manager.audioManager.playSound('success');
        button.classList.add('restored');
        button.style.background = 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)';
        button.textContent = '✓ ' + button.textContent.replace('Restore ', '');
        button.style.pointerEvents = 'none';

        this.fixedSystems++;
        progress.textContent = `Systems restored: ${this.fixedSystems} / 4`;

        if (this.fixedSystems === 4) {
          setTimeout(() => this.completeStory(), 1000);
        }
      });
    });
  }

  completeStory() {
    this.manager.uiManager.hideGameUI();
    this.manager.audioManager.playSound('beep');
    this.manager.uiManager.createConfetti();

    this.manager.uiManager.showNarration(
      "Hooray! All systems are working perfectly! Farmer Arya's tractor is running, the power is on, and everyone is happy!",
      () => {
        this.manager.uiManager.showNarration(
          "The adventure ends with Sunny, Sparky, Earth, and all their friends smiling together. Every challenge taught them how to stay safe, work together, and enjoy the wonders of space weather!",
          () => {
            this.showFinalMessage();
          }
        );
      }
    );
  }

  showFinalMessage() {
    const finalHTML = `
      <h2 style="color: #ffd700; text-align: center;">🌟 Congratulations! 🌟</h2>
      <p style="text-align: center; font-size: 20px; margin: 20px 0;">
        You completed the Space Weather Story!
      </p>
      <p style="text-align: center; font-size: 16px; margin: 20px 0;">
        You learned about solar flares, auroras, and how space weather affects Earth!
      </p>
      <div style="text-align: center; margin-top: 25px;">
        <button class="next-button" id="restart-btn">Start New Adventure</button>
      </div>
    `;

    this.manager.uiManager.showGameUI(finalHTML);

    document.getElementById('restart-btn').addEventListener('click', () => {
      this.manager.audioManager.playSound('click');
      this.manager.loadScene(0);
    });
  }

  update(deltaTime) {
    if (this.sun) {
      this.sun.rotation.y += deltaTime * 0.5;
    }

    if (this.sparky) {
      this.sparky.rotation.y -= deltaTime * 0.5;
      this.sparky.position.y = 3 + Math.sin(Date.now() * 0.002) * 0.2;
    }

    if (this.earth) {
      this.earth.rotation.y += deltaTime * 0.3;
    }

    if (this.tractor) {
      this.tractor.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
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
