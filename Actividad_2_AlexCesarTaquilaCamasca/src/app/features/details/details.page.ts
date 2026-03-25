import { Component, inject, NgModule,Input, } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MovieService } from 'src/app/core/services/movie.service';
import { NavController } from '@ionic/angular';
import { ConfettiComponent } from 'src/app/shared/confetti.component';
  
@Component({
  selector: 'app-details',
  templateUrl: 'details.page.html',
  styleUrls: ['details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ConfettiComponent],
})

export class DetailsPage {
  movieService = inject(MovieService);
  route = inject(ActivatedRoute);
  navCtrl = inject(NavController);

  // Accede a la película seleccionada:
  @Input() imdbID?: string;

  ngOnInit() {
    // Limpia el Signal antes de cargar una nueva película
    this.movieService.clearCurrentMovie();
    
    if (this.imdbID) {
      this.movieService.getMovieDetails(this.imdbID);
    }
  } 

    get movie() {
      return this.movieService.currentMovie();
    }


}

