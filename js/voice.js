/**
 * MindFlex Voice Utility
 * Provides text-to-speech functionality for the MindFlex application
 */

class VoiceUtility {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voice = null;
    this.volume = 1.0;
    this.rate = 1.0;
    this.pitch = 1.0;
    this.enabled = true;
    
    // Try to load saved preferences
    this.loadPreferences();
    
    // Initialize voices when they're loaded
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = this.initializeVoices.bind(this);
    }
    
    // Initialize voices immediately in case they're already loaded
    this.initializeVoices();
  }
  
  /**
   * Initialize available voices and select a default
   */
  initializeVoices() {
    const voices = this.synth.getVoices();
    
    if (voices.length === 0) {
      console.warn("No voices available for speech synthesis");
      return;
    }
    
    // Try to find a good default voice if none is set
    if (!this.voice) {
      // Prefer these voices in order
      const preferredVoices = [
        { lang: 'en-US', name: 'Google US English' },
        { lang: 'en-US', name: 'Microsoft Zira' },
        { lang: 'en-US', name: 'Samantha' },
        { lang: 'en-GB', name: 'Google UK English Female' },
        { lang: 'en-GB', name: 'Microsoft Hazel' }
      ];
      
      // Try to find one of the preferred voices
      for (const preferred of preferredVoices) {
        const match = voices.find(v => 
          v.lang.startsWith(preferred.lang) && 
          v.name.includes(preferred.name)
        );
        
        if (match) {
          this.voice = match;
          break;
        }
      }
      
      // If no preferred voice found, just use the first English voice
      if (!this.voice) {
        this.voice = voices.find(v => v.lang.startsWith('en')) || voices[0];
      }
      
      // Save the selected voice
      this.savePreferences();
    }
  }
  
  /**
   * Speak the provided text
   * @param {string} text - The text to speak
   * @param {boolean} interrupt - Whether to interrupt current speech
   * @returns {Promise} Resolves when speech is complete
   */
  speak(text, interrupt = true) {
    return new Promise((resolve, reject) => {
      // If voice is disabled, resolve immediately
      if (!this.enabled) {
        resolve();
        return;
      }
      
      // Cancel current speech if interrupt is true
      if (interrupt && this.synth.speaking) {
        this.synth.cancel();
      }
      
      // If already speaking and not interrupting, reject
      if (!interrupt && this.synth.speaking) {
        reject(new Error("Already speaking"));
        return;
      }
      
      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice and properties
      if (this.voice) utterance.voice = this.voice;
      utterance.volume = this.volume;
      utterance.rate = this.rate;
      utterance.pitch = this.pitch;
      
      // Set up event handlers
      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech error: ${event.error}`));
      
      // Speak the text
      this.synth.speak(utterance);
    });
  }
  
  /**
   * Toggle voice on/off
   * @param {boolean} enabled - Whether voice should be enabled
   */
  toggleVoice(enabled) {
    if (enabled === undefined) {
      this.enabled = !this.enabled;
    } else {
      this.enabled = enabled;
    }
    
    // Cancel any current speech if disabled
    if (!this.enabled && this.synth.speaking) {
      this.synth.cancel();
    }
    
    this.savePreferences();
    return this.enabled;
  }
  
  /**
   * Set voice parameters
   * @param {Object} params - Parameters to set
   */
  setParameters(params = {}) {
    if (params.volume !== undefined) this.volume = params.volume;
    if (params.rate !== undefined) this.rate = params.rate;
    if (params.pitch !== undefined) this.pitch = params.pitch;
    
    this.savePreferences();
  }
  
  /**
   * Save voice preferences to localStorage
   */
  savePreferences() {
    try {
      const preferences = {
        enabled: this.enabled,
        volume: this.volume,
        rate: this.rate,
        pitch: this.pitch,
        voiceName: this.voice ? this.voice.name : null
      };
      
      localStorage.setItem('mindflexVoicePreferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving voice preferences:', error);
    }
  }
  
  /**
   * Load voice preferences from localStorage
   */
  loadPreferences() {
    try {
      const savedPrefs = localStorage.getItem('mindflexVoicePreferences');
      
      if (savedPrefs) {
        const preferences = JSON.parse(savedPrefs);
        
        this.enabled = preferences.enabled !== undefined ? preferences.enabled : true;
        this.volume = preferences.volume || 1.0;
        this.rate = preferences.rate || 1.0;
        this.pitch = preferences.pitch || 1.0;
        
        // Voice will be set when voices are loaded
        this.savedVoiceName = preferences.voiceName;
      }
    } catch (error) {
      console.error('Error loading voice preferences:', error);
    }
  }
  
  /**
   * Get a list of all available voices
   * @returns {Array} Array of available voices
   */
  getVoices() {
    return this.synth.getVoices();
  }
  
  /**
   * Set a specific voice by name
   * @param {string} name - Name of the voice to use
   * @returns {boolean} Whether the voice was found and set
   */
  setVoice(name) {
    const voices = this.synth.getVoices();
    const voice = voices.find(v => v.name === name);
    
    if (voice) {
      this.voice = voice;
      this.savePreferences();
      return true;
    }
    
    return false;
  }
}

// Create and export a singleton instance
const voiceUtility = new VoiceUtility();
export default voiceUtility;
