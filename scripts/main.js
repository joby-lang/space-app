import * as THREE from 'three';
import { SceneManager } from './SceneManager.js';
import { AudioManager } from './AudioManager.js';
import { UIManager } from './UIManager.js';

class SpaceWeatherApp {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.homeScreen = document.getElementById('home-screen');
    this.uiOverlay = document.getElementById('ui-overlay');
    this.settingsPanel = document.getElementById('settings-panel');
    this.currentSceneIndex = 0;
    this.isPlaying = false;

    this.initThree();
    this.audioManager = new AudioManager();
    this.uiManager = new UIManager(this.audioManager);
    this.sceneManager = new SceneManager(this.scene, this.camera, this.renderer, this.audioManager, this.uiManager);

    this.setupHomeScreen();
    this.setupEventListeners();
    this.animate();
  }

  setupHomeScreen() {
    document.getElementById('play-btn').addEventListener('click', () => {
      this.startStory();
    });

    document.getElementById('replay-btn').addEventListener('click', () => {
      this.startStory();
    });

    document.getElementById('settings-btn').addEventListener('click', () => {
      this.audioManager.playSound('click');
      this.settingsPanel.classList.remove('hidden');
    });

    document.getElementById('close-settings').addEventListener('click', () => {
      this.audioManager.playSound('click');
      this.settingsPanel.classList.add('hidden');
    });

    document.getElementById('subtitles-toggle').addEventListener('change', (e) => {
      this.uiManager.subtitlesEnabled = e.target.checked;
    });

    document.getElementById('narration-toggle').addEventListener('change', (e) => {
      this.audioManager.enabled = e.target.checked;
    });

    document.getElementById('home-btn').addEventListener('click', () => {
      this.returnHome();
    });
  }

  startStory() {
    this.audioManager.playSound('whoosh');
    this.homeScreen.style.animation = 'fadeOut 0.5s ease-out forwards';

    setTimeout(() => {
      this.homeScreen.classList.add('hidden');
      this.canvas.classList.remove('hidden');
      this.uiOverlay.classList.remove('hidden');
      this.isPlaying = true;
      this.sceneManager.loadScene(0);
    }, 500);
  }

  returnHome() {
    this.audioManager.playSound('click');
    this.sceneManager.cleanup();
    this.canvas.classList.add('hidden');
    this.uiOverlay.classList.add('hidden');
    this.homeScreen.classList.remove('hidden');
    this.homeScreen.style.animation = 'fadeIn 0.5s ease-out forwards';
    this.isPlaying = false;
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a1a);

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 10;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.onResize());

    this.canvas.addEventListener('click', (e) => this.onClick(e));
    this.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
    this.canvas.addEventListener('touchmove', (e) => this.onTouchMove(e));
    this.canvas.addEventListener('touchend', (e) => this.onTouchEnd(e));

    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
  }

  onClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.sceneManager.handleClick(x, y);
  }

  onTouchStart(event) {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

      this.sceneManager.handleTouchStart(x, y);
    }
  }

  onTouchMove(event) {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

      this.sceneManager.handleTouchMove(x, y);
    }
  }

  onTouchEnd(event) {
    this.sceneManager.handleTouchEnd();
  }

  onMouseDown(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.sceneManager.handleMouseDown(x, y);
  }

  onMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.sceneManager.handleMouseMove(x, y);
  }

  onMouseUp(event) {
    this.sceneManager.handleMouseUp();
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const deltaTime = 0.016;
    this.sceneManager.update(deltaTime);

    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new SpaceWeatherApp();
});
