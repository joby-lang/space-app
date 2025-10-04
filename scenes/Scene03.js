import * as THREE from 'three';

export class Scene03 {
  constructor(sceneManager) {
    this.manager = sceneManager;
    this.objects = [];
    this.gameState = {
      cables: ['red', 'blue', 'green', 'yellow'],
      matched: [],
      currentDrag: null
    };
  }

  init() {
    this.manager.threeScene.background = new THREE.Color(0x1a2f4a);
    this.createScene();
    this.startNarration();
  }

  createScene() {
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x3a5f4a });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -3;
    this.manager.threeScene.add(ground);
    this.objects.push(ground);

    this.createTractor();
    this.createSatellite();
    this.createPowerLines();
  }

  createTractor() {
    const tractorGroup = new THREE.Group();

    const bodyGeometry = new THREE.BoxGeometry(1.5, 0.8, 2);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.4;
    tractorGroup.add(body);

    const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });

    const positions = [
      [-0.6, -0.1, 0.7],
      [0.6, -0.1, 0.7],
      [-0.6, -0.1, -0.7],
      [0.6, -0.1, -0.7]
    ];

    positions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(pos[0], pos[1], pos[2]);
      tractorGroup.add(wheel);
    });

    tractorGroup.position.set(-3, -2, 0);
    this.manager.threeScene.add(tractorGroup);
    this.objects.push(tractorGroup);
  }

  createSatellite() {
    const satelliteGroup = new THREE.Group();

    const bodyGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    satelliteGroup.add(body);

    const panelGeometry = new THREE.BoxGeometry(2, 0.05, 1);
    const panelMaterial = new THREE.MeshStandardMaterial({ color: 0x2244aa });

    const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    leftPanel.position.x = -1.4;
    satelliteGroup.add(leftPanel);

    const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    rightPanel.position.x = 1.4;
    satelliteGroup.add(rightPanel);

    satelliteGroup.position.set(0, 3, -3);
    satelliteGroup.userData.wobble = 0;
    this.manager.threeScene.add(satelliteGroup);
    this.objects.push(satelliteGroup);
    this.satellite = satelliteGroup;
  }

  createPowerLines() {
    const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 8);
    const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

    for (let i = 0; i < 3; i++) {
      const pole = new THREE.Mesh(poleGeometry, poleMaterial);
      pole.position.set(3 + i * 2, 0, 0);
      this.manager.threeScene.add(pole);
      this.objects.push(pole);
    }
  }

  startNarration() {
    this.manager.uiManager.showSceneTitle('Scene 3: Helping Farmers & Engineers');

    setTimeout(() => {
      this.manager.uiManager.showNarration(
        "Oh no! Farmer Arya's tractor stopped working and the GPS is failing! Engineer Ravi needs help fixing the power lines.",
        () => {
          this.manager.uiManager.showNarration(
            "The solar flare caused problems with technology on Earth. Let's help fix them!",
            () => {
              this.showCableGame();
            }
          );
        }
      );
    }, 3000);
  }

  showCableGame() {
    this.manager.uiManager.hideNarration();

    const gameHTML = `
      <h2>Match the Cables!</h2>
      <p>Drag each cable to its matching socket</p>
      <div class="cable-container">
        <div class="cable" draggable="true" data-color="red" style="background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);">🔌</div>
        <div class="cable" draggable="true" data-color="blue" style="background: linear-gradient(135deg, #0000ff 0%, #0000cc 100%);">🔌</div>
        <div class="cable" draggable="true" data-color="green" style="background: linear-gradient(135deg, #00ff00 0%, #00cc00 100%);">🔌</div>
        <div class="cable" draggable="true" data-color="yellow" style="background: linear-gradient(135deg, #ffff00 0%, #cccc00 100%);">🔌</div>
      </div>
      <div class="cable-container">
        <div class="socket" data-color="red" style="background: linear-gradient(135deg, #ff6666 0%, #ff3333 100%);">⚡</div>
        <div class="socket" data-color="blue" style="background: linear-gradient(135deg, #6666ff 0%, #3333ff 100%);">⚡</div>
        <div class="socket" data-color="green" style="background: linear-gradient(135deg, #66ff66 0%, #33ff33 100%);">⚡</div>
        <div class="socket" data-color="yellow" style="background: linear-gradient(135deg, #ffff66 0%, #ffff33 100%);">⚡</div>
      </div>
    `;

    this.manager.uiManager.showGameUI(gameHTML);
    this.setupCableGame();
  }

  setupCableGame() {
    const cables = document.querySelectorAll('.cable');
    const sockets = document.querySelectorAll('.socket');

    cables.forEach(cable => {
      cable.addEventListener('dragstart', (e) => {
        this.gameState.currentDrag = e.target.dataset.color;
        e.target.style.opacity = '0.5';
      });

      cable.addEventListener('dragend', (e) => {
        e.target.style.opacity = '1';
      });

      cable.addEventListener('touchstart', (e) => {
        this.gameState.currentDrag = e.target.dataset.color;
        e.target.style.opacity = '0.5';
      });

      cable.addEventListener('touchend', (e) => {
        e.target.style.opacity = '1';
      });
    });

    sockets.forEach(socket => {
      socket.addEventListener('dragover', (e) => {
        e.preventDefault();
      });

      socket.addEventListener('drop', (e) => {
        e.preventDefault();
        const socketColor = e.target.dataset.color;

        if (this.gameState.currentDrag === socketColor) {
          this.manager.audioManager.playSound('success');
          e.target.style.background = 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)';
          e.target.textContent = '✓';

          const cable = document.querySelector(`.cable[data-color="${socketColor}"]`);
          if (cable) {
            cable.style.display = 'none';
          }

          this.gameState.matched.push(socketColor);

          if (this.gameState.matched.length === 4) {
            setTimeout(() => this.completeGame(), 500);
          }
        } else {
          this.manager.audioManager.playSound('boink');
        }
      });

      socket.addEventListener('click', (e) => {
        if (this.gameState.currentDrag) {
          const socketColor = e.target.dataset.color;

          if (this.gameState.currentDrag === socketColor) {
            this.manager.audioManager.playSound('success');
            e.target.style.background = 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)';
            e.target.textContent = '✓';

            const cable = document.querySelector(`.cable[data-color="${socketColor}"]`);
            if (cable) {
              cable.style.display = 'none';
            }

            this.gameState.matched.push(socketColor);
            this.gameState.currentDrag = null;

            if (this.gameState.matched.length === 4) {
              setTimeout(() => this.completeGame(), 500);
            }
          } else {
            this.manager.audioManager.playSound('boink');
            this.gameState.currentDrag = null;
          }
        }
      });
    });

    cables.forEach(cable => {
      cable.addEventListener('click', (e) => {
        this.gameState.currentDrag = e.target.dataset.color;
        this.manager.audioManager.playSound('click');
        cables.forEach(c => c.style.border = '3px solid rgba(255, 255, 255, 0.3)');
        e.target.style.border = '3px solid #00ff00';
      });
    });
  }

  completeGame() {
    this.manager.audioManager.playSound('beep');
    this.manager.uiManager.hideGameUI();

    this.manager.uiManager.showNarration(
      "Great job! The tractor's GPS is working again, and the power is restored! Farmer Arya and Engineer Ravi are very happy!",
      () => {
        this.manager.nextScene();
      }
    );
  }

  update(deltaTime) {
    if (this.satellite) {
      this.satellite.userData.wobble += deltaTime * 2;
      this.satellite.rotation.z = Math.sin(this.satellite.userData.wobble) * 0.1;
      this.satellite.rotation.y += deltaTime * 0.5;
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
