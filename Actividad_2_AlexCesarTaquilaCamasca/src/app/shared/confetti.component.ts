import { Component } from '@angular/core';
import confetti from 'canvas-confetti';
import { MovieService } from '../core/services/movie.service';

@Component({
  selector: 'app-confetti',
  template: '',
  standalone: true
})
export class ConfettiComponent {
  constructor(private movieService: MovieService) {
    this.movieService.confetti$.subscribe(() => this.spawnConfetti());
  }

  spawnConfetti() {
    confetti({
      particleCount: 300,
      spread: 150,
      origin: { y: 0.5 },

    });
  }
}
