import * as THREE from 'three';

export class Scene07 {
  constructor(sceneManager) {
    this.manager = sceneManager;
    this.objects = [];
    this.radiationWaves = [];
    this.shieldActive = false;
    this.wavesCleared = 0;
    this.challengePhase = 'astronaut';
  }

  init() {
    this.manager.threeScene.background = new THREE.Color(0x0a0a1a);
    this.createScene();
    this.startNarration();
  }

  createScene() {
    this.createStarfield();
    this.createSpaceStation();
    this.createAstronaut();
  }

  createStarfield() {
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];

    for (let i = 0; i < 400; i++) {
      const x = (Math.random() - 0.5) * 150;
      const y = (Math.random() - 0.5) * 150;
      const z = (Math.random() - 0.5) * 150;
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

  createSpaceStation() {
    const stationGroup = new THREE.Group();

    const moduleGeometry = new THREE.CylinderGeometry(0.8, 0.8, 3, 8);
    const moduleMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const module = new THREE.Mesh(moduleGeometry, moduleMaterial);
    module.rotation.z = Math.PI / 2;
    stationGroup.add(module);

    const solarPanelGeometry = new THREE.BoxGeometry(3, 0.05, 1.5);
    const solarPanelMaterial = new THREE.MeshStandardMaterial({ color: 0x2244aa });

    const leftPanel = new THREE.Mesh(solarPanelGeometry, solarPanelMaterial);
    leftPanel.position.set(0, 1.5, 0);
    stationGroup.add(leftPanel);

    const rightPanel = new THREE.Mesh(solarPanelGeometry, solarPanelMaterial);
    rightPanel.position.set(0, -1.5, 0);
    stationGroup.add(rightPanel);

    stationGroup.position.set(-4, 0, -3);

    this.manager.threeScene.add(stationGroup);
    this.objects.push(stationGroup);
    this.spaceStation = stationGroup;
  }

  createAstronaut() {
    const astronautGroup = new THREE.Group();

    const helmetGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const helmetMaterial = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      transparent: true,
      opacity: 0.8
    });
    const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
    helmet.position.y = 1;
    astronautGroup.add(helmet);

    const faceGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const faceMaterial = new THREE.MeshStandardMaterial({ color: 0xffccaa });
    const face = new THREE.Mesh(faceGeometry, faceMaterial);
    face.position.set(0, 1, 0.1);
    astronautGroup.add(face);

    const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.4, 1, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.2;
    astronautGroup.add(body);

    const armGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 8);
    const leftArm = new THREE.Mesh(armGeometry, bodyMaterial);
    leftArm.position.set(-0.5, 0.3, 0);
    leftArm.rotation.z = Math.PI / 4;
    astronautGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, bodyMaterial);
    rightArm.position.set(0.5, 0.3, 0);
    rightArm.rotation.z = -Math.PI / 4;
    astronautGroup.add(rightArm);

    astronautGroup.position.set(2, 0, 0);
    astronautGroup.userData.floatOffset = 0;

    this.manager.threeScene.add(astronautGroup);
    this.objects.push(astronautGroup);
    this.astronaut = astronautGroup;
  }

  createRadiationWave(x, y) {
    const waveGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const waveMaterial = new THREE.MeshStandardMaterial({
      color: 0xff4444,
      emissive: 0xff0000,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.7
    });
    const wave = new THREE.Mesh(waveGeometry, waveMaterial);
    wave.position.set(x, y, 0);

    wave.userData.pulseOffset = Math.random() * Math.PI * 2;
    wave.userData.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02,
      0
    );

    this.manager.threeScene.add(wave);
    this.radiationWaves.push(wave);
    this.objects.push(wave);
  }

  startNarration() {
    this.manager.uiManager.showSceneTitle('Scene 7: Space Challenges');

    setTimeout(() => {
      this.manager.uiManager.showNarration(
        "Astronaut Alex is floating near the space station when radiation waves approach!",
        () => {
          this.manager.uiManager.showNarration(
            "Help Alex by tapping the radiation waves to reduce their strength, or use the shield to protect Alex!",
            () => {
              this.showAstronautChallenge();
            }
          );
        }
      );
    }, 3000);
  }

  showAstronautChallenge() {
    this.manager.uiManager.hideNarration();

    for (let i = 0; i < 8; i++) {
      const x = Math.random() * 8 - 4;
      const y = Math.random() * 6 - 3;
      this.createRadiationWave(x, y);
    }

    const gameHTML = `
      <h2>Protect Alex!</h2>
      <p>Tap radiation waves to neutralize them!</p>
      <p id="wave-counter">Waves remaining: 8</p>
      <button class="shield-button" id="shield-btn">🛡️</button>
    `;

    this.manager.uiManager.showGameUI(gameHTML);

    document.getElementById('shield-btn').addEventListener('click', () => {
      this.activateShield();
    });

    this.enableInteraction = true;
  }

  activateShield() {
    if (this.shieldActive) return;

    this.shieldActive = true;
    this.manager.audioManager.playSound('whoosh');

    const shieldGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const shieldMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ccff,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
    shield.position.copy(this.astronaut.position);

    this.manager.threeScene.add(shield);
    this.objects.push(shield);
    this.activeShield = shield;

    this.radiationWaves.forEach(wave => {
      const distance = wave.position.distanceTo(this.astronaut.position);
      if (distance < 3) {
        this.removeWave(wave);
      }
    });

    setTimeout(() => {
      this.manager.threeScene.remove(shield);
      this.shieldActive = false;
      this.activeShield = null;
    }, 2000);
  }

  removeWave(wave) {
    const index = this.radiationWaves.indexOf(wave);
    if (index > -1) {
      this.radiationWaves.splice(index, 1);
      this.manager.threeScene.remove(wave);
      this.wavesCleared++;

      const waveCounter = document.getElementById('wave-counter');
      if (waveCounter) {
        waveCounter.textContent = `Waves remaining: ${8 - this.wavesCleared}`;
      }

      if (this.wavesCleared >= 8 && this.challengePhase === 'astronaut') {
        setTimeout(() => this.showPilotChallenge(), 1000);
      }
    }
  }

  showPilotChallenge() {
    this.challengePhase = 'pilot';
    this.manager.uiManager.hideGameUI();

    this.manager.uiManager.showNarration(
      "Great job protecting Alex! Now Pilot Mia needs help fixing her crackling radio signals!",
      () => {
        this.showRadioGame();
      }
    );
  }

  showRadioGame() {
    this.manager.uiManager.hideNarration();

    const gameHTML = `
      <h2>Fix the Radio!</h2>
      <p>Tap the buttons in the correct sequence: Red → Blue → Green</p>
      <div style="display: flex; justify-content: center; gap: 15px; margin-top: 20px;">
        <button class="icon-button" data-color="red" style="background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);">Red</button>
        <button class="icon-button" data-color="blue" style="background: linear-gradient(135deg, #0000ff 0%, #0000cc 100%);">Blue</button>
        <button class="icon-button" data-color="green" style="background: linear-gradient(135deg, #00ff00 0%, #00cc00 100%);">Green</button>
      </div>
      <p id="sequence-feedback" style="text-align: center; margin-top: 15px; font-size: 18px;"></p>
    `;

    this.manager.uiManager.showGameUI(gameHTML);
    this.setupRadioGame();
  }

  setupRadioGame() {
    const sequence = ['red', 'blue', 'green'];
    let currentStep = 0;
    const buttons = document.querySelectorAll('[data-color]');
    const feedback = document.getElementById('sequence-feedback');

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const color = button.dataset.color;

        if (color === sequence[currentStep]) {
          this.manager.audioManager.playSound('success');
          feedback.textContent = `✓ ${color.toUpperCase()} correct!`;
          feedback.style.color = '#00ff00';
          currentStep++;

          if (currentStep === sequence.length) {
            setTimeout(() => this.completeScene(), 1000);
          }
        } else {
          this.manager.audioManager.playSound('boink');
          feedback.textContent = '✗ Wrong! Try again from the start.';
          feedback.style.color = '#ff0000';
          currentStep = 0;
        }
      });
    });
  }

  completeScene() {
    this.manager.uiManager.hideGameUI();

    this.manager.uiManager.showNarration(
      "Excellent work! Alex is safe and Mia's radio is working perfectly! You understand how to protect against space weather effects!",
      () => {
        this.manager.nextScene();
      }
    );
  }

  handleClick(x, y) {
    if (!this.enableInteraction || this.challengePhase !== 'astronaut') return;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), this.manager.camera);

    const intersects = raycaster.intersectObjects(this.radiationWaves);

    if (intersects.length > 0) {
      this.manager.audioManager.playSound('success');
      this.removeWave(intersects[0].object);
    }
  }

  update(deltaTime) {
    if (this.astronaut) {
      this.astronaut.userData.floatOffset += deltaTime;
      this.astronaut.position.y = Math.sin(this.astronaut.userData.floatOffset) * 0.3;
    }

    if (this.spaceStation) {
      this.spaceStation.rotation.y += deltaTime * 0.2;
    }

    this.radiationWaves.forEach(wave => {
      wave.userData.pulseOffset += deltaTime * 3;
      wave.scale.setScalar(1 + Math.sin(wave.userData.pulseOffset) * 0.2);
      wave.position.add(wave.userData.velocity);

      if (Math.abs(wave.position.x) > 10 || Math.abs(wave.position.y) > 8) {
        wave.userData.velocity.multiplyScalar(-1);
      }
    });

    if (this.activeShield) {
      this.activeShield.rotation.y += deltaTime * 2;
      this.activeShield.rotation.x += deltaTime;
    }
  }

  cleanup() {
    this.objects.forEach(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
      this.manager.threeScene.remove(obj);
    });
    this.objects = [];
    this.radiationWaves = [];
    this.manager.uiManager.hideGameUI();
    this.manager.uiManager.hideNarration();
    this.manager.uiManager.hideSceneTitle();
  }
}
