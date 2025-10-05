import { Scene01 } from '../scenes/Scene01.js';
import { Scene02 } from '../scenes/Scene02.js';
import { Scene03 } from '../scenes/Scene03.js';
import { Scene04 } from '../scenes/Scene04.js';
import { Scene05 } from '../scenes/Scene05.js';
import { Scene06 } from '../scenes/Scene06.js';
import { Scene07 } from '../scenes/Scene07.js';
import { Scene08 } from '../scenes/Scene08.js';

export class SceneManager {
  constructor(scene, camera, renderer, audioManager, uiManager) {
    this.threeScene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.audioManager = audioManager;
    this.uiManager = uiManager;

    this.scenes = [
      new Scene01(this),
      new Scene02(this),
      new Scene03(this),
      new Scene04(this),
      new Scene05(this),
      new Scene06(this),
      new Scene07(this),
      new Scene08(this)
    ];

    this.currentSceneIndex = 0;
    this.currentScene = null;
  }

  loadScene(index) {
    if (index < 0 || index >= this.scenes.length) {
      console.log('All scenes completed!');
      this.uiManager.showNarration('The End! Thank you for joining our space adventure!', () => {
        this.loadScene(0);
      });
      return;
    }

    if (this.currentScene) {
      this.currentScene.cleanup();
    }

    this.currentSceneIndex = index;
    this.currentScene = this.scenes[index];
    this.currentScene.init();

    const progress = ((index + 1) / this.scenes.length) * 100;
    this.uiManager.updateProgress(progress);
    this.uiManager.updateSceneIndicator(index + 1, this.scenes.length);
    this.uiManager.astronautNarrator.classList.remove('hidden');
  }

  cleanup() {
    if (this.currentScene) {
      this.currentScene.cleanup();
      this.currentScene = null;
    }
    this.uiManager.hideNarration();
    this.uiManager.hideDialogue();
    this.uiManager.hideGameUI();
    this.uiManager.hideSceneTitle();
    this.uiManager.hideAstronautNarrator();
  }

  nextScene() {
    this.loadScene(this.currentSceneIndex + 1);
  }

  update(deltaTime) {
    if (this.currentScene) {
      this.currentScene.update(deltaTime);
    }
  }

  handleClick(x, y) {
    if (this.currentScene && this.currentScene.handleClick) {
      this.currentScene.handleClick(x, y);
    }
  }

  handleTouchStart(x, y) {
    if (this.currentScene && this.currentScene.handleTouchStart) {
      this.currentScene.handleTouchStart(x, y);
    }
  }

  handleTouchMove(x, y) {
    if (this.currentScene && this.currentScene.handleTouchMove) {
      this.currentScene.handleTouchMove(x, y);
    }
  }

  handleTouchEnd() {
    if (this.currentScene && this.currentScene.handleTouchEnd) {
      this.currentScene.handleTouchEnd();
    }
  }

  handleMouseDown(x, y) {
    if (this.currentScene && this.currentScene.handleMouseDown) {
      this.currentScene.handleMouseDown(x, y);
    }
  }

  handleMouseMove(x, y) {
    if (this.currentScene && this.currentScene.handleMouseMove) {
      this.currentScene.handleMouseMove(x, y);
    }
  }

  handleMouseUp() {
    if (this.currentScene && this.currentScene.handleMouseUp) {
      this.currentScene.handleMouseUp();
    }
  }
}
