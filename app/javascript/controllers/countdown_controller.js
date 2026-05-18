import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["days", "hours", "minutes", "seconds", "daysContainer", "hoursContainer", "progressBar"]
  static values = {
    endTime: String,
    startDays: Number,
    startHours: Number,
    startMinutes: Number,
    startSeconds: Number,
    hideEmpty: { type: Boolean, default: true },
    useGlobalTimer: { type: Boolean, default: true }
  }

  connect() {
    // Get the current time from the timer service if available
    const now = this.useGlobalTimerValue && window.timerService ?
                window.timerService.getCurrentTime() :
                new Date();

    // If endTime is provided, use it as the target date
    if (this.hasEndTimeValue) {
      this.endDate = new Date(this.endTimeValue)
    } else {
      // Otherwise, use the static values to calculate the end date
      this.endDate = new Date(
        now.getTime() +
        (this.startDaysValue || 0) * 24 * 60 * 60 * 1000 +
        (this.startHoursValue || 0) * 60 * 60 * 1000 +
        (this.startMinutesValue || 0) * 60 * 1000 +
        (this.startSecondsValue || 0) * 1000
      )
    }

    // Calculate total duration in milliseconds
    this.startTime = now
    this.totalDuration = this.endDate - this.startTime

    // Create the update callback for the timer service
    this.updateCallback = this.updateCountdown.bind(this)

    // Start the countdown
    this.startCountdown()
  }

  disconnect() {
    this.stopCountdown()
  }

  startCountdown() {
    // Try to use the global timer service if available and enabled
    if (this.useGlobalTimerValue && window.timerService) {
      window.timerService.subscribe(this.updateCallback)
      // Initial update happens in the subscribe method
    } else {
      // Fallback to local timer if global service is not available
      this.updateCountdown(new Date()) // Update immediately
      this.interval = setInterval(() => {
        this.updateCountdown(new Date())
      }, 1000)
    }
  }

  stopCountdown() {
    // Unsubscribe from global timer if we were using it
    if (this.useGlobalTimerValue && window.timerService) {
      window.timerService.unsubscribe(this.updateCallback)
    }

    // Clear local interval if we were using that
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }

  updateCountdown(timestamp) {
    // Use the timestamp directly from the timer service
    // No need to round as it's already aligned to the second

    // Calculate difference based on the shared timestamp
    const difference = this.endDate - timestamp

    if (difference <= 0) {
      // Countdown has ended
      this.stopCountdown()
      this.setValues(0, 0, 0, 0)
      this.updateProgressBar(100) // Set progress to 100% when complete
      this.dispatch("complete")
      return
    }

    // Calculate remaining time
    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)

    // Update the countdown display
    this.setValues(days, hours, minutes, seconds)

    // Update progress bar
    const elapsed = this.totalDuration - difference
    const progressPercentage = (elapsed / this.totalDuration) * 100
    this.updateProgressBar(progressPercentage)

    // Hide days and hours containers if they're zero and hideEmpty is true
    if (this.hideEmptyValue) {
      this.toggleVisibility(this.hasDaysContainerTarget, this.daysContainerTarget, days > 0)
      this.toggleVisibility(this.hasHoursContainerTarget, this.hoursContainerTarget, hours > 0 || days > 0)
    }
  }

  updateProgressBar(percentage) {
    if (this.hasProgressBarTarget) {
      // Ensure percentage is between 0 and 100
      const clampedPercentage = Math.min(Math.max(percentage, 0), 100)
      this.progressBarTarget.value = clampedPercentage
    }
  }

  toggleVisibility(hasTarget, target, isVisible) {
    if (hasTarget) {
      if (isVisible) {
        target.classList.remove('hidden')
      } else {
        target.classList.add('hidden')
      }
    }
  }

  setValues(days, hours, minutes, seconds) {
    if (this.hasDaysTarget) {
      this.daysTarget.style.setProperty('--value', days)
      this.daysTarget.setAttribute('aria-label', days)
      this.daysTarget.textContent = days
    }

    if (this.hasHoursTarget) {
      this.hoursTarget.style.setProperty('--value', hours)
      this.hoursTarget.setAttribute('aria-label', hours)
      this.hoursTarget.textContent = hours
    }

    if (this.hasMinutesTarget) {
      this.minutesTarget.style.setProperty('--value', minutes)
      this.minutesTarget.setAttribute('aria-label', minutes)
      this.minutesTarget.textContent = minutes
    }

    if (this.hasSecondsTarget) {
      this.secondsTarget.style.setProperty('--value', seconds)
      this.secondsTarget.setAttribute('aria-label', seconds)
      this.secondsTarget.textContent = seconds
    }
  }
}
