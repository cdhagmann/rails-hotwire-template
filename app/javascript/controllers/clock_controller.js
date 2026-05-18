import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["clockDisplay"]
  static values = {
    useGlobalTimer: { type: Boolean, default: true },
    format: { type: String, default: "HH:mm:ss" }
  }

  connect() {
    // Create the update callback for the timer service
    this.updateCallback = this.updateClock.bind(this)

    // Start the clock
    this.startClock()
  }

  disconnect() {
    this.stopClock()
  }

  startClock() {
    // Try to use the global timer service if available and enabled
    if (this.useGlobalTimerValue && window.timerService) {
      window.timerService.subscribe(this.updateCallback)
      // Initial update happens in the subscribe method
    } else {
      // Fallback to local timer if global service is not available
      this.updateClock(new Date()) // Update immediately
      this.intervalId = setInterval(() => {
        this.updateClock(new Date())
      }, 1000)
    }
  }

  stopClock() {
    // Unsubscribe from global timer if we were using it
    if (this.useGlobalTimerValue && window.timerService) {
      window.timerService.unsubscribe(this.updateCallback)
    }

    // Clear local interval if we were using that
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  updateClock(timestamp) {
    // Use the timestamp directly from the timer service
    // No need to round as it's already aligned to the second
    if (this.hasClockDisplayTarget) {
      const timeString = this.formatTime(timestamp);
      this.clockDisplayTarget.textContent = timeString;
    }
  }

  formatTime(date) {
    if (this.hasFormatValue) {
      // Custom formatting based on format value
      const format = this.formatValue;
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      return format
        .replace('HH', hours.toString().padStart(2, '0'))
        .replace('H', hours.toString())
        .replace('hh', (hours % 12 || 12).toString().padStart(2, '0'))
        .replace('h', (hours % 12 || 12).toString())
        .replace('mm', minutes.toString().padStart(2, '0'))
        .replace('m', minutes.toString())
        .replace('ss', seconds.toString().padStart(2, '0'))
        .replace('s', seconds.toString())
        .replace('a', hours >= 12 ? 'pm' : 'am')
        .replace('A', hours >= 12 ? 'PM' : 'AM');
    } else {
      // Default formatting
      return date.toLocaleTimeString();
    }
  }
}
