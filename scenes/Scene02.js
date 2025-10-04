import * as THREE from 'three';

export class Scene02 {
  constructor(sceneManager) {
    this.manager = sceneManager;
    this.objects = [];
    this.sparky = null;
    this.planets = [];
    this.obstacles = [];
    this.trail = [];
    this.dialogueStep = 0;
    this.isDragging = false;
  }

  init() {
    this.manager.threeScene.background = new THREE.Color(0x0a0a1a);
    this.createStarfield();
    this.createSparky();
    this.createPlanets();
    this.createObstacles();
    this.startScene();
  }

  createStarfield() {
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];

    for (let i = 0; i < 300; i++) {
      const x = (Math.random() - 0.5) * 150;
      const y = (Math.random() - 0.5) * 150;
      const z = (Math.random() - 0.5) * 150;
      starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.4,
      transparent: true,
      opacity: 0.8
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    this.manager.threeScene.add(stars);
    this.objects.push(stars);
  }

  createSparky() {
    const sparkyGroup = new THREE.Group();

    const sparkyGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const sparkyMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 1
    });
    const sparkyMesh = new THREE.Mesh(sparkyGeometry, sparkyMaterial);
    sparkyGroup.add(sparkyMesh);

    const eyeGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.2, 0.1, 0.4);
    sparkyGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.2, 0.1, 0.4);
    sparkyGroup.add(rightEye);

    const glowGeometry = new THREE.SphereGeometry(0.7, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.3
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    sparkyGroup.add(glow);

    sparkyGroup.position.set(-8, 0, 0);
    this.manager.threeScene.add(sparkyGroup);
    this.objects.push(sparkyGroup);
    this.sparky = sparkyGroup;
  }

  createPlanets() {
    const planetData = [
      { name: 'Mars', x: -3, y: 2, size: 0.8, color: 0xff6666, message: "Hey Sparky! Where are you heading?" },
      { name: 'Venus', x: 3, y: -2, size: 0.9, color: 0xffaa66, message: "Stay safe out there!" },
      { name: 'Earth', x: 8, y: 0, size: 1, color: 0x6699ff, message: "Welcome, Sparky!" }
    ];

    planetData.forEach(data => {
      const planetGroup = new THREE.Group();

      const geometry = new THREE.SphereGeometry(data.size, 32, 32);
      const material = new THREE.MeshStandardMaterial({ color: data.color });
      const planet = new THREE.Mesh(geometry, material);
      planetGroup.add(planet);

      const eyeSize = data.size * 0.15;
      const eyeGeometry = new THREE.SphereGeometry(eyeSize, 8, 8);
      const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

      const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      leftEye.position.set(-data.size * 0.3, data.size * 0.2, data.size * 0.8);
      planetGroup.add(leftEye);

      const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      rightEye.position.set(data.size * 0.3, data.size * 0.2, data.size * 0.8);
      planetGroup.add(rightEye);

      const pupilGeometry = new THREE.SphereGeometry(eyeSize * 0.5, 8, 8);
      const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

      const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
      leftPupil.position.set(-data.size * 0.3, data.size * 0.2, data.size * 0.9);
      planetGroup.add(leftPupil);

      const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
      rightPupil.position.set(data.size * 0.3, data.size * 0.2, data.size * 0.9);
      planetGroup.add(rightPupil);

      planetGroup.position.set(data.x, data.y, -2);
      planetGroup.userData.name = data.name;
      planetGroup.userData.message = data.message;

      this.manager.threeScene.add(planetGroup);
      this.objects.push(planetGroup);
      this.planets.push(planetGroup);
    });
  }

  createObstacles() {
    for (let i = 0; i < 5; i++) {
      const size = 0.3 + Math.random() * 0.3;
      const geometry = new THREE.IcosahedronGeometry(size, 0);
      const material = new THREE.MeshStandardMaterial({
        color: 0x666666,
        roughness: 0.8
      });
      const rock = new THREE.Mesh(geometry, material);

      rock.position.set(
        Math.random() * 10 - 5,
        Math.random() * 6 - 3,
        -1
      );

      rock.userData.rotationSpeed = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      );

      this.manager.threeScene.add(rock);
      this.objects.push(rock);
      this.obstacles.push(rock);
    }
  }

  startScene() {
    this.manager.uiManager.showSceneTitle('Scene 2: Sparky Zooms Through Space');

    setTimeout(() => {
      this.manager.uiManager.showNarration(
        "Watch Sparky race across space! Drag Sparky to avoid the floating space rocks.",
        () => {
          this.manager.uiManager.hideNarration();
          this.enableInteraction = true;
          this.showPlanetDialogue();
        }
      );
    }, 3000);
  }

  showPlanetDialogue() {
    const dialogues = [
      { planet: this.planets[0], delay: 2000 },
      { planet: this.planets[1], delay: 5000 }
    ];

    dialogues.forEach(({ planet, delay }) => {
      setTimeout(() => {
        if (planet) {
          this.manager.uiManager.showDialogue(
            planet.userData.name,
            planet.userData.message,
            3000
          );
        }
      }, delay);
    });

    setTimeout(() => {
      this.manager.uiManager.showNarration(
        "Zoom, zoom! Earth, here I come!",
        () => {
          this.manager.nextScene();
        }
      );
    }, 10000);
  }

  handleMouseDown(x, y) {
    if (!this.enableInteraction) return;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), this.manager.camera);

    const intersects = raycaster.intersectObject(this.sparky, true);

    if (intersects.length > 0) {
      this.isDragging = true;
      this.manager.audioManager.playSound('click');
    }
  }

  handleMouseMove(x, y) {
    if (!this.isDragging || !this.enableInteraction) return;

    const vector = new THREE.Vector3(x, y, 0.5);
    vector.unproject(this.manager.camera);

    const dir = vector.sub(this.manager.camera.position).normalize();
    const distance = -this.manager.camera.position.z / dir.z;
    const pos = this.manager.camera.position.clone().add(dir.multiplyScalar(distance));

    this.sparky.position.x = THREE.MathUtils.clamp(pos.x, -9, 9);
    this.sparky.position.y = THREE.MathUtils.clamp(pos.y, -4, 4);

    this.checkCollisions();
  }

  handleMouseUp() {
    this.isDragging = false;
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

  checkCollisions() {
    this.obstacles.forEach(obstacle => {
      const distance = this.sparky.position.distanceTo(obstacle.position);
      if (distance < 1) {
        this.manager.audioManager.playSound('boink');

        obstacle.position.x = Math.random() * 10 - 5;
        obstacle.position.y = Math.random() * 6 - 3;
      }
    });
  }

  createTrailParticle() {
    const geometry = new THREE.SphereGeometry(0.1, 8, 8);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.6
    });
    const particle = new THREE.Mesh(geometry, material);
    particle.position.copy(this.sparky.position);
    particle.userData.life = 1.0;

    this.manager.threeScene.add(particle);
    this.trail.push(particle);
    this.objects.push(particle);
  }

  update(deltaTime) {
    if (this.sparky && !this.isDragging) {
      this.sparky.position.x += deltaTime * 0.5;
      this.sparky.rotation.y += deltaTime * 2;
    }

    if (this.sparky && Math.random() < 0.1) {
      this.createTrailParticle();
    }

    this.trail.forEach((particle, index) => {
      particle.userData.life -= deltaTime;
      particle.material.opacity = particle.userData.life * 0.6;
      particle.scale.setScalar(1 - (1 - particle.userData.life));

      if (particle.userData.life <= 0) {
        this.manager.threeScene.remove(particle);
        this.trail.splice(index, 1);
      }
    });

    this.obstacles.forEach(obstacle => {
      obstacle.rotation.x += obstacle.userData.rotationSpeed.x * deltaTime;
      obstacle.rotation.y += obstacle.userData.rotationSpeed.y * deltaTime;
      obstacle.rotation.z += obstacle.userData.rotationSpeed.z * deltaTime;
    });

    this.planets.forEach(planet => {
      planet.rotation.y += deltaTime * 0.5;
    });
  }

  cleanup() {
    this.objects.forEach(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
      this.manager.threeScene.remove(obj);
    });
    this.objects = [];
    this.planets = [];
    this.obstacles = [];
    this.trail = [];
    this.manager.uiManager.hideNarration();
    this.manager.uiManager.hideDialogue();
    this.manager.uiManager.hideSceneTitle();
  }
}
