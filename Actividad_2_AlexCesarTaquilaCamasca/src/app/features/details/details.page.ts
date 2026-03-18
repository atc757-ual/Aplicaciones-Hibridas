import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MovieService } from 'src/app/core/services/movie.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-details',
  templateUrl: 'details.page.html',
  styleUrls: ['details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class DetailsPage {
  movieService = inject(MovieService);
  route = inject(ActivatedRoute);
  navCtrl = inject(NavController);

  // Accede a la película seleccionada:
 
  ngOnInit() {
    // Limpia el Signal antes de cargar una nueva película
    this.movieService.clearCurrentMovie();
    const imdbID = this.route.snapshot.paramMap.get('imdbID');
    if (imdbID) {
      this.movieService.getMovieDetails(imdbID);
    }
  } 

  get movie() {
    return this.movieService.currentMovie();
  }

  goBack() {
    this.navCtrl.back();
  }

  getRating(movie: any): number {
    return movie.imdbRating ? Math.round(Number(movie.imdbRating) / 2) : 0;
  }
}
