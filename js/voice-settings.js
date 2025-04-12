/**
 * MindFlex Voice Settings Component
 * Provides a UI for controlling voice settings
 */

import voiceUtility from './voice.js';

class VoiceSettings {
  constructor(containerId = 'voice-settings-container') {
    this.containerId = containerId;
    this.container = null;
    this.isOpen = false;
    
    // Create the settings panel
    this.createSettingsPanel();
    
    // Initialize event listeners
    this.initEventListeners();
  }
  
  /**
   * Create the voice settings panel
   */
  createSettingsPanel() {
    // Check if container already exists
    const existingContainer = document.getElementById(this.containerId);
    if (existingContainer) {
      this.container = existingContainer;
      return;
    }
    
    // Create container
    this.container = document.createElement('div');
    this.container.id = this.containerId;
    this.container.className = 'fixed bottom-4 right-4 z-50';
    
    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.id = 'voice-toggle-btn';
    toggleButton.className = 'bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-purple-700 transition';
    toggleButton.innerHTML = voiceUtility.enabled ? 
      '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.465a5 5 0 001.06-7.072m-2.829 9.9a9 9 0 010-12.728" /></svg>' :
      '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15.465a5 5 0 001.06-7.072m-2.829 9.9a9 9 0 010-12.728" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 12L6 12" /></svg>';
    
    // Create settings panel (initially hidden)
    const settingsPanel = document.createElement('div');
    settingsPanel.id = 'voice-settings-panel';
    settingsPanel.className = 'bg-white rounded-lg shadow-lg p-4 mt-2 w-64 hidden';
    settingsPanel.innerHTML = `
      <h3 class="text-lg font-semibold text-purple-700 mb-3">Voice Settings</h3>
      
      <div class="mb-3">
        <label class="flex items-center cursor-pointer">
          <input type="checkbox" id="voice-enabled" class="form-checkbox h-5 w-5 text-purple-600" ${voiceUtility.enabled ? 'checked' : ''}>
          <span class="ml-2 text-gray-700">Enable Voice</span>
        </label>
      </div>
      
      <div class="mb-3">
        <label class="block text-sm text-gray-700 mb-1">Volume</label>
        <input type="range" id="voice-volume" min="0" max="1" step="0.1" value="${voiceUtility.volume}" class="w-full">
      </div>
      
      <div class="mb-3">
        <label class="block text-sm text-gray-700 mb-1">Speed</label>
        <input type="range" id="voice-rate" min="0.5" max="2" step="0.1" value="${voiceUtility.rate}" class="w-full">
      </div>
      
      <div class="mb-3">
        <label class="block text-sm text-gray-700 mb-1">Pitch</label>
        <input type="range" id="voice-pitch" min="0.5" max="2" step="0.1" value="${voiceUtility.pitch}" class="w-full">
      </div>
      
      <button id="voice-test-btn" class="bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200 transition w-full">
        Test Voice
      </button>
    `;
    
    // Append elements to container
    this.container.appendChild(toggleButton);
    this.container.appendChild(settingsPanel);
    
    // Add to document
    document.body.appendChild(this.container);
  }
  
  /**
   * Initialize event listeners for the settings panel
   */
  initEventListeners() {
    // Toggle button click
    const toggleButton = document.getElementById('voice-toggle-btn');
    toggleButton.addEventListener('click', () => {
      this.toggleSettingsPanel();
    });
    
    // Enable/disable checkbox
    const enabledCheckbox = document.getElementById('voice-enabled');
    enabledCheckbox.addEventListener('change', (e) => {
      const enabled = e.target.checked;
      voiceUtility.toggleVoice(enabled);
      this.updateToggleButtonIcon(enabled);
      
      // Announce state change
      if (enabled) {
        voiceUtility.speak('Voice enabled');
      }
    });
    
    // Volume slider
    const volumeSlider = document.getElementById('voice-volume');
    volumeSlider.addEventListener('change', (e) => {
      voiceUtility.setParameters({ volume: parseFloat(e.target.value) });
      voiceUtility.speak('Volume adjusted');
    });
    
    // Rate slider
    const rateSlider = document.getElementById('voice-rate');
    rateSlider.addEventListener('change', (e) => {
      voiceUtility.setParameters({ rate: parseFloat(e.target.value) });
      voiceUtility.speak('Speed adjusted');
    });
    
    // Pitch slider
    const pitchSlider = document.getElementById('voice-pitch');
    pitchSlider.addEventListener('change', (e) => {
      voiceUtility.setParameters({ pitch: parseFloat(e.target.value) });
      voiceUtility.speak('Pitch adjusted');
    });
    
    // Test button
    const testButton = document.getElementById('voice-test-btn');
    testButton.addEventListener('click', () => {
      voiceUtility.speak('This is a test of the MindFlex voice system. How does it sound?');
    });
    
    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.container.contains(e.target)) {
        this.toggleSettingsPanel(false);
      }
    });
  }
  
  /**
   * Toggle the settings panel open/closed
   * @param {boolean} open - Force open or closed state
   */
  toggleSettingsPanel(open) {
    const panel = document.getElementById('voice-settings-panel');
    
    if (open === undefined) {
      this.isOpen = !this.isOpen;
    } else {
      this.isOpen = open;
    }
    
    if (this.isOpen) {
      panel.classList.remove('hidden');
    } else {
      panel.classList.add('hidden');
    }
  }
  
  /**
   * Update the toggle button icon based on enabled state
   * @param {boolean} enabled - Whether voice is enabled
   */
  updateToggleButtonIcon(enabled) {
    const toggleButton = document.getElementById('voice-toggle-btn');
    
    toggleButton.innerHTML = enabled ? 
      '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.465a5 5 0 001.06-7.072m-2.829 9.9a9 9 0 010-12.728" /></svg>' :
      '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15.465a5 5 0 001.06-7.072m-2.829 9.9a9 9 0 010-12.728" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 12L6 12" /></svg>';
  }
}

// Export the class
export default VoiceSettings;
