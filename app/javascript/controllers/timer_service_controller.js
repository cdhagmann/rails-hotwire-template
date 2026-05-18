import { Controller } from "@hotwired/stimulus"

// This controller acts as a centralized timer service
// Other controllers can subscribe to its tick events
export default class extends Controller {
  static values = {
    interval: { type: Number, default: 1000 } // Default to 1 second
  }

  static targets = ["debug"]

  // Array to store callback functions from subscribers
  subscribers = []

  // Shared timestamp that all components will use
  sharedTimestamp = null

  connect() {
    // Initialize the shared timestamp
    this.sharedTimestamp = this.getSecondAlignedTimestamp()

    // Start the timer when controller connects
    this.startTimer()

    // Make the service globally available
    window.timerService = this

    if (this.hasDebugTarget) {
      this.debugTarget.textContent = "Timer service connected"
    }
  }

  disconnect() {
    // Clean up when controller disconnects
    this.stopTimer()

    // Remove global reference
    if (window.timerService === this) {
      window.timerService = null
    }
  }

  // Get a timestamp aligned to the second
  getSecondAlignedTimestamp() {
    const now = new Date()
    // Floor to the nearest second (not round) to ensure we're at the start of a second
    return new Date(Math.floor(now.getTime() / 1000) * 1000)
  }

  startTimer() {
    // Clear any existing interval
    this.stopTimer()

    // Calculate the delay until the next second boundary
    const now = new Date()
    const msToNextSecond = 1000 - now.getMilliseconds()

    // First tick: align with the second boundary
    setTimeout(() => {
      // Update the shared timestamp to the current second
      this.sharedTimestamp = this.getSecondAlignedTimestamp()
      this.tick()

      // Then start the regular interval exactly on the second
      this.timer = setInterval(() => {
        // Increment the shared timestamp by exactly one second
        this.sharedTimestamp = new Date(this.sharedTimestamp.getTime() + 1000)
        this.tick()
      }, 1000) // Always use exactly 1000ms for the interval

    }, msToNextSecond)

    // Dispatch an event to notify that the timer has started
    this.dispatch("start")
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null

      // Dispatch an event to notify that the timer has stopped
      this.dispatch("stop")
    }
  }

  tick() {
    // Use the shared timestamp for all subscribers
    // This ensures everyone gets exactly the same time

    if (this.hasDebugTarget) {
      this.debugTarget.textContent = `Shared time: ${this.sharedTimestamp.toLocaleTimeString()}`
    }

    // Notify all subscribers with the same exact timestamp
    this.subscribers.forEach(callback => {
      try {
        callback(this.sharedTimestamp)
      } catch (error) {
        console.error("Error in timer subscriber:", error)
      }
    })

    // Dispatch a tick event that other controllers can listen for
    this.dispatch("tick", { detail: { time: this.sharedTimestamp } })
  }

  // Method for other controllers to subscribe to timer updates
  subscribe(callback) {
    if (typeof callback === 'function' && !this.subscribers.includes(callback)) {
      this.subscribers.push(callback)
      // Immediately call with current shared timestamp
      callback(this.sharedTimestamp)
      return true
    }
    return false
  }

  // Method for other controllers to unsubscribe
  unsubscribe(callback) {
    const index = this.subscribers.indexOf(callback)
    if (index !== -1) {
      this.subscribers.splice(index, 1)
      return true
    }
    return false
  }

  // Method for components to get the current shared timestamp
  getCurrentTime() {
    return this.sharedTimestamp
  }
}
