// audio.js - Mia & Seb's Theme (La La Land) Romantic Background Music Manager
class RomanticAudioManager {
  constructor() {
    this.audio = null;
    this.audioSrc = '/assets/audio/la_la_land_theme.mp3';
    this.isPlaying = false;
    this.targetVolume = 0.65;
    this.fadeTimer = null;
    this.hasStartedOnce = false;
    this.listeners = [];
  }

  init() {
    if (!this.audio) {
      this.audio = new Audio(this.audioSrc);
      this.audio.loop = true;
      this.audio.volume = 0;
      this.audio.preload = 'auto';

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.notify();
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notify();
      });
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
    callback(this.isPlaying);
  }

  notify() {
    this.listeners.forEach((fn) => {
      try {
        fn(this.isPlaying);
      } catch (e) {
        console.error('Audio listener error:', e);
      }
    });
  }

  fadeTo(target, duration = 1200) {
    if (!this.audio) return;
    clearInterval(this.fadeTimer);

    const startVol = this.audio.volume;
    const diff = target - startVol;
    const steps = 30;
    const stepTime = duration / steps;
    let step = 0;

    this.fadeTimer = setInterval(() => {
      step++;
      const progress = step / steps;
      // Sinusoidal easing curve
      const ease = Math.sin((progress * Math.PI) / 2);
      this.audio.volume = Math.max(0, Math.min(1, startVol + diff * ease));

      if (step >= steps) {
        clearInterval(this.fadeTimer);
        this.audio.volume = target;
        if (target === 0 && !this.isPlaying) {
          this.audio.pause();
        }
      }
    }, stepTime);
  }

  async play() {
    this.init();
    try {
      this.isPlaying = true;
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
      this.fadeTo(this.targetVolume, 1500);
      this.notify();
      return true;
    } catch (err) {
      console.warn('Audio play deferred (browser user-gesture policy):', err);
      this.isPlaying = false;
      this.notify();
      return false;
    }
  }

  pause() {
    if (!this.audio) return;
    this.isPlaying = false;
    this.fadeTo(0, 800);
    this.notify();
  }

  toggle() {
    this.init();
    if (this.audio && !this.audio.paused && this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  duck() {
    if (this.audio && this.isPlaying) {
      this.fadeTo(0.12, 600);
    }
  }

  unduck() {
    if (this.audio && this.isPlaying) {
      this.fadeTo(this.targetVolume, 900);
    }
  }

  setupAutoPlayOnFirstInteraction() {
    const startAudio = () => {
      if (!this.hasStartedOnce) {
        this.hasStartedOnce = true;
        this.play();
      }
      window.removeEventListener('pointerdown', startAudio);
      window.removeEventListener('scroll', startAudio);
      window.removeEventListener('keydown', startAudio);
      window.removeEventListener('touchstart', startAudio);
    };

    window.addEventListener('pointerdown', startAudio, { once: true, passive: true });
    window.addEventListener('scroll', startAudio, { once: true, passive: true });
    window.addEventListener('keydown', startAudio, { once: true, passive: true });
    window.addEventListener('touchstart', startAudio, { once: true, passive: true });
  }
}

export const romanticAudio = new RomanticAudioManager();
