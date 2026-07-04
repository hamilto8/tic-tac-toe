/**
 * ============================================================================
 * Tic Tac Toe — Sound Manager Module
 * Encapsulates audio effects and mute preference persistence.
 * ============================================================================
 */

export const SoundManager = {
  sounds: {
    click: new Audio('./sound/bassDrum.mp3'),
    moveX: new Audio('./sound/light-beep.mp3'),
    moveO: new Audio('./sound/low-beep.mp3'),
    win: new Audio('./sound/success.mp3'),
    lose: new Audio('./sound/failure.mp3'),
    tie: new Audio('./sound/alert.mp3'),
    error: new Audio('./sound/wrong.mp3'),
  },
  isMuted: false,

  init() {
    // Load mute setting from localStorage if available
    try {
      const savedMute = localStorage.getItem('ttt_muted');
      if (savedMute !== null) {
        this.isMuted = savedMute === 'true';
      }
    } catch (e) {
      console.warn('localStorage access denied or unavailable:', e);
    }
  },

  play(soundName) {
    if (this.isMuted || !this.sounds[soundName]) return;
    
    try {
      const audio = this.sounds[soundName];
      audio.currentTime = 0;
      audio.play().catch(err => {
        // Browser autoplay policy might block audio before first user interaction
        console.debug('Audio play blocked by browser policy:', err);
      });
    } catch (e) {
      console.error('Error playing sound:', e);
    }
  },

  toggleMute() {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('ttt_muted', String(this.isMuted));
    } catch (e) {
      // Ignore localStorage error
    }
    return this.isMuted;
  }
};
