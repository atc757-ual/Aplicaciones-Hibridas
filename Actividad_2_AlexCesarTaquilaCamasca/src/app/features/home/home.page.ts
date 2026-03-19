import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MovieService } from 'src/app/core/services/movie.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, CommonModule]
})
export class HomePage {

  movieService = inject(MovieService);
  searchTerm: string = '';

  onSearch(event:any){
    const query = event.detail.value;

    if(query){
      this.movieService.searchMovies(query);
      this.searchTerm = query;
    }
  }
  
  /*Lista de peliculas*/
  get movies() {
    return this.movieService.movies();
  }

  /*Lista de favoritos*/
  get favoriteMovies() {
    return this.movieService.getFavorites();
  }
  
}
