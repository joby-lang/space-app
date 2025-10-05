import * as THREE from 'three';

export class Scene01 {
  constructor(sceneManager) {
    this.manager = sceneManager;
    this.objects = [];
    this.sun = null;
    this.sparky = null;
    this.particles = [];
    this.stars = [];
    this.narrationStep = 0;
  }

  init() {
    this.manager.threeScene.background = new THREE.Color(0x0a0a1a);
    this.createStarfield();
    this.createSun();
    this.createPlanets();
    this.startNarration();
  }

  createStarfield() {
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];

    for (let i = 0; i < 200; i++) {
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.3,
      transparent: true,
      opacity: 0.8
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    this.manager.threeScene.add(stars);
    this.stars.push(stars);
    this.objects.push(stars);
  }

  createSun() {
    const sunGroup = new THREE.Group();

    const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
    const sunMaterial = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      emissive: 0xff6600,
      emissiveIntensity: 0.8
    });
    this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sunGroup.add(this.sun);

    const eyeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.5, 0.5, 1.8);
    sunGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.5, 0.5, 1.8);
    sunGroup.add(rightEye);

    const smileGeometry = new THREE.TorusGeometry(0.5, 0.1, 16, 50, Math.PI);
    const smileMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const smile = new THREE.Mesh(smileGeometry, smileMaterial);
    smile.position.set(0, 0, 1.8);
    smile.rotation.x = Math.PI;
    sunGroup.add(smile);

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const ropeGeometry = new THREE.CylinderGeometry(0.1, 0.05, 1.5, 8);
      const ropeMaterial = new THREE.MeshStandardMaterial({
        color: 0xff8800,
        emissive: 0xff6600,
        emissiveIntensity: 0.5
      });
      const rope = new THREE.Mesh(ropeGeometry, ropeMaterial);

      rope.position.x = Math.cos(angle) * 2.2;
      rope.position.y = Math.sin(angle) * 2.2;
      rope.rotation.z = angle + Math.PI / 2;

      rope.userData.originalRotation = angle + Math.PI / 2;
      rope.userData.animationOffset = i * 0.5;

      sunGroup.add(rope);
    }

    const glowGeometry = new THREE.SphereGeometry(2.5, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.2
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    sunGroup.add(glow);

    sunGroup.position.set(0, 0, 0);
    this.manager.threeScene.add(sunGroup);
    this.objects.push(sunGroup);
    this.sun = sunGroup;
  }

  createPlanets() {
    const planetPositions = [
      { x: -8, y: 2, z: -5, size: 0.5, color: 0x8899ff },
      { x: 8, y: -2, z: -5, size: 0.4, color: 0xffaa88 },
      { x: -6, y: -3, z: -8, size: 0.3, color: 0xff99ff }
    ];

    planetPositions.forEach(pos => {
      const geometry = new THREE.SphereGeometry(pos.size, 16, 16);
      const material = new THREE.MeshStandardMaterial({ color: pos.color });
      const planet = new THREE.Mesh(geometry, material);
      planet.position.set(pos.x, pos.y, pos.z);
      this.manager.threeScene.add(planet);
      this.objects.push(planet);
    });
  }

  launchSparky() {
    if (this.sparky) {
      this.sparky.parent.remove(this.sparky);
    }

    const sparkyGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const sparkyMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 1
    });
    this.sparky = new THREE.Mesh(sparkyGeometry, sparkyMaterial);
    this.sparky.position.set(0, 0, 2);

    const sparkGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const sparkMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.5
    });
    const spark = new THREE.Mesh(sparkGeometry, sparkMaterial);
    this.sparky.add(spark);

    this.manager.threeScene.add(this.sparky);
    this.objects.push(this.sparky);

    this.sparky.userData.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.2,
      (Math.random() - 0.5) * 0.2,
      0.3
    );

    this.manager.audioManager.playSound('whoosh');

    this.createSparkParticles(this.sparky.position);
  }

  createSparkParticles(position) {
    for (let i = 0; i < 10; i++) {
      const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        transparent: true,
        opacity: 1
      });
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.position.copy(position);

      particle.userData.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1
      );
      particle.userData.life = 1.0;

      this.manager.threeScene.add(particle);
      this.particles.push(particle);
      this.objects.push(particle);
    }
  }

  startNarration() {
    this.manager.uiManager.showSceneTitle('Scene 1: Meet Sunny the Sun');
    this.manager.uiManager.showAstronautNarrator("Hi kids! Did you know our Sun sometimes sneezes solar flares?", 4000);

    setTimeout(() => {
      this.showNextNarration();
    }, 4500);
  }

  showNextNarration() {
    const narrations = [
      "Meet Sunny the Sun! Sunny is our friendly star who keeps us warm and bright.",
      "Watch as Sunny stretches and launches a little solar flare named Sparky!",
      "Tap on Sunny's rays to launch Sparky multiple times!"
    ];

    if (this.narrationStep < narrations.length) {
      this.manager.uiManager.showNarration(narrations[this.narrationStep], () => {
        this.narrationStep++;
        if (this.narrationStep < narrations.length) {
          this.showNextNarration();
        } else {
          this.manager.uiManager.hideNarration();
          this.enableInteraction = true;
        }
      });
    }
  }

  handleClick(x, y) {
    if (!this.enableInteraction) return;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), this.manager.camera);

    const intersects = raycaster.intersectObjects(this.manager.threeScene.children, true);

    if (intersects.length > 0) {
      const object = intersects[0].object;
      if (object.parent === this.sun || object === this.sun) {
        this.launchSparky();
      }
    }
  }

  update(deltaTime) {
    if (this.sun) {
      this.sun.rotation.y += deltaTime * 0.5;

      this.sun.children.forEach((child, index) => {
        if (child.geometry && child.geometry.type === 'CylinderGeometry') {
          const offset = child.userData.animationOffset || 0;
          const scale = 1 + Math.sin(Date.now() * 0.002 + offset) * 0.2;
          child.scale.y = scale;
        }
      });
    }

    if (this.sparky) {
      this.sparky.position.add(this.sparky.userData.velocity);
      this.sparky.rotation.x += deltaTime * 2;
      this.sparky.rotation.y += deltaTime * 2;

      if (this.sparky.position.length() > 20) {
        this.manager.uiManager.showNarration(
          "Great job! Sparky is on its way to Earth! Let's see what happens next.",
          () => {
            this.manager.nextScene();
          }
        );
      }
    }

    this.particles.forEach((particle, index) => {
      particle.position.add(particle.userData.velocity);
      particle.userData.life -= deltaTime;
      particle.material.opacity = particle.userData.life;

      if (particle.userData.life <= 0) {
        this.manager.threeScene.remove(particle);
        this.particles.splice(index, 1);
      }
    });

    this.stars.forEach(star => {
      star.rotation.y += deltaTime * 0.05;
    });
  }

  cleanup() {
    this.objects.forEach(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
      this.manager.threeScene.remove(obj);
    });
    this.objects = [];
    this.particles = [];
    this.stars = [];
    this.manager.uiManager.hideNarration();
    this.manager.uiManager.hideSceneTitle();
  }
}
