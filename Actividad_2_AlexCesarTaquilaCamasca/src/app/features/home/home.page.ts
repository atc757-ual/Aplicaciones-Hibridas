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

  // Datos emulados para el carousel de favoritos
  favoriteMovies = [
    {
      imdbID: 'tt0111161',
      Title: 'The Shawshank Redemption',
      Year: '1994',
      Poster: 'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmRhMC00ZDJlLWFmNTEtODM1ZmRlYzY3ZTMxXkEyXkFqcGdeQXVyNDYyMDk5MTU@._V1_SX300.jpg',
      Genre: 'Drama',
      imdbRating: '9.3'
    },
    {
      imdbID: 'tt0068646',
      Title: 'The Godfather',
      Year: '1972',
      Poster: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmYtYTAwOC00ZjQ5LWFmNTEtODM1ZmRlYzY3ZTMxXkEyXkFqcGdeQXVyNDYyMDk5MTU@._V1_SX300.jpg',
      Genre: 'Crime',
      imdbRating: '9.2'
    },
    {
      imdbID: 'tt0468569',
      Title: 'The Dark Knight',
      Year: '2008',
      Poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMDk5MTU@._V1_SX300.jpg',
      Genre: 'Action',
      imdbRating: '9.0'
    }
  ];

  favoriteIndex = 0;

  prevFavorite() {
    this.favoriteIndex = (this.favoriteIndex - 1 + this.favoriteMovies.length) % this.favoriteMovies.length;
  }

  nextFavorite() {
    this.favoriteIndex = (this.favoriteIndex + 1) % this.favoriteMovies.length;
  }

  onSearch(event:any){
    const query = event.detail.value;

    if(query){
      this.movieService.searchMovies(query);
    }
  }
  
  get movies() {
    return this.movieService.movies();
  }

}
