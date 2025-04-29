import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["clockDisplay"]

  connect() {
    this.intervalId = setInterval(this.updateClock.bind(this), 1000);
  }

  disconnect() {
    clearInterval(this.intervalId);
  }

  updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    this.clockDisplayTarget.textContent = timeString;
  }
}
