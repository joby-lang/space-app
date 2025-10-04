import * as THREE from 'three';

export class Scene04 {
  constructor(sceneManager) {
    this.manager = sceneManager;
    this.objects = [];
    this.auroraParticles = [];
    this.isDrawing = false;
    this.lastDrawPos = null;
  }

  init() {
    this.manager.threeScene.background = new THREE.Color(0x0a0a1a);
    this.createScene();
    this.startNarration();
  }

  createScene() {
    this.createStarfield();
    this.createEarth();
    this.createPlane();
    this.createChildren();
  }

  createStarfield() {
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];

    for (let i = 0; i < 400; i++) {
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
    earth.position.set(5, -2, -5);

    this.manager.threeScene.add(earth);
    this.objects.push(earth);
    this.earth = earth;
  }

  createPlane() {
    const planeGroup = new THREE.Group();

    const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.z = Math.PI / 2;
    planeGroup.add(body);

    const wingGeometry = new THREE.BoxGeometry(3, 0.1, 0.8);
    const wingMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const wings = new THREE.Mesh(wingGeometry, wingMaterial);
    planeGroup.add(wings);

    const windowGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const windowMaterial = new THREE.MeshStandardMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0.7
    });

    for (let i = -0.5; i <= 0.5; i += 0.5) {
      const window = new THREE.Mesh(windowGeometry, windowMaterial);
      window.position.set(i, 0.3, 0);
      planeGroup.add(window);
    }

    planeGroup.position.set(-3, 2, 0);
    planeGroup.userData.floatOffset = 0;

    this.manager.threeScene.add(planeGroup);
    this.objects.push(planeGroup);
    this.plane = planeGroup;
  }

  createChildren() {
    const childrenGroup = new THREE.Group();

    for (let i = 0; i < 3; i++) {
      const childGroup = new THREE.Group();

      const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
      const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffccaa });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.y = 0.6;
      childGroup.add(head);

      const bodyGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.6, 8);
      const colors = [0xff6666, 0x66ff66, 0x6666ff];
      const bodyMaterial = new THREE.MeshStandardMaterial({ color: colors[i] });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      childGroup.add(body);

      childGroup.position.x = (i - 1) * 1;
      childrenGroup.add(childGroup);
    }

    childrenGroup.position.set(0, -2, 2);

    this.manager.threeScene.add(childrenGroup);
    this.objects.push(childrenGroup);
    this.children = childrenGroup;
  }

  startNarration() {
    this.manager.uiManager.showSceneTitle('Scene 4: Pilots & Beautiful Auroras');

    setTimeout(() => {
      this.manager.uiManager.showNarration(
        "Pilot Mia is flying when her radio starts crackling! But look at the beautiful auroras in the sky!",
        () => {
          this.manager.uiManager.showNarration(
            "Solar particles hitting Earth's atmosphere create these colorful lights! Swipe across the sky to paint your own aurora!",
            () => {
              this.showAuroraGame();
            }
          );
        }
      );
    }, 3000);
  }

  showAuroraGame() {
    this.manager.uiManager.hideNarration();
    this.enableInteraction = true;

    const gameHTML = `
      <h2>Paint an Aurora!</h2>
      <p>Swipe or click and drag on the screen to create beautiful aurora lights</p>
      <div style="text-align: center; margin-top: 20px;">
        <button class="icon-button" id="finish-aurora">Finish Aurora</button>
      </div>
    `;

    this.manager.uiManager.showGameUI(gameHTML);

    document.getElementById('finish-aurora').addEventListener('click', () => {
      this.completeGame();
    });

    setTimeout(() => {
      if (this.auroraParticles.length === 0) {
        this.createAuroraHint();
      }
    }, 3000);
  }

  createAuroraHint() {
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const x = Math.random() * 10 - 5;
        const y = Math.random() * 3 + 2;
        this.createAuroraParticle(x, y);
      }, i * 50);
    }
  }

  createAuroraParticle(x, y) {
    const colors = [0x00ff88, 0xff00ff, 0x8800ff, 0x00ffff];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const geometry = new THREE.SphereGeometry(0.2, 8, 8);
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.6
    });
    const particle = new THREE.Mesh(geometry, material);

    const worldPos = this.screenToWorld(x, y);
    particle.position.copy(worldPos);

    particle.userData.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.02,
      Math.random() * 0.05,
      0
    );
    particle.userData.life = 3.0;

    this.manager.threeScene.add(particle);
    this.auroraParticles.push(particle);
    this.objects.push(particle);
  }

  screenToWorld(screenX, screenY) {
    const vector = new THREE.Vector3(screenX, screenY, 0.5);
    vector.unproject(this.manager.camera);

    const dir = vector.sub(this.manager.camera.position).normalize();
    const distance = -this.manager.camera.position.z / dir.z;
    return this.manager.camera.position.clone().add(dir.multiplyScalar(distance));
  }

  handleMouseDown(x, y) {
    if (!this.enableInteraction) return;
    this.isDrawing = true;
    this.lastDrawPos = { x, y };
    this.createAuroraParticle(x * 5, y * 3);
  }

  handleMouseMove(x, y) {
    if (!this.enableInteraction || !this.isDrawing) return;

    if (this.lastDrawPos) {
      const distance = Math.sqrt(
        Math.pow(x - this.lastDrawPos.x, 2) + Math.pow(y - this.lastDrawPos.y, 2)
      );

      if (distance > 0.1) {
        this.createAuroraParticle(x * 5, y * 3);
        this.lastDrawPos = { x, y };
      }
    }
  }

  handleMouseUp() {
    this.isDrawing = false;
    this.lastDrawPos = null;
  }

  handleTouchStart(x, y) {
    this.handleMouseDown(x, y);
  }

  handleTouchMove(x, y) {
    this.handleMouseMove(x, y);
  }

  handleTouchEnd() {
    this.handleMouseUp();
  }

  completeGame() {
    this.enableInteraction = false;
    this.manager.audioManager.playSound('success');
    this.manager.uiManager.hideGameUI();

    this.manager.uiManager.showNarration(
      "Beautiful! These auroras are caused by solar particles colliding with gases in Earth's atmosphere. They're nature's light show!",
      () => {
        this.manager.nextScene();
      }
    );
  }

  update(deltaTime) {
    if (this.earth) {
      this.earth.rotation.y += deltaTime * 0.3;
    }

    if (this.plane) {
      this.plane.userData.floatOffset += deltaTime;
      this.plane.position.y = 2 + Math.sin(this.plane.userData.floatOffset) * 0.3;
    }

    this.auroraParticles.forEach((particle, index) => {
      particle.position.add(particle.userData.velocity);
      particle.userData.life -= deltaTime * 0.3;
      particle.material.opacity = Math.min(0.6, particle.userData.life * 0.2);

      particle.scale.setScalar(1 + (3 - particle.userData.life) * 0.2);

      if (particle.userData.life <= 0) {
        this.manager.threeScene.remove(particle);
        this.auroraParticles.splice(index, 1);
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
    this.auroraParticles = [];
    this.manager.uiManager.hideGameUI();
    this.manager.uiManager.hideNarration();
    this.manager.uiManager.hideSceneTitle();
  }
}
