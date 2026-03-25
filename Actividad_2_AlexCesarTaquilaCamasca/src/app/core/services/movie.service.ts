import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, NgModule, signal } from '@angular/core';
import { environment } from 'src/environments/environment.local';
import { Movie, OMDbResponse } from './models/movie.model';
import { ConfettiComponent } from 'src/app/shared/confetti.component';
import { Subject } from 'rxjs/internal/Subject';
@Injectable({
  providedIn: 'root'
})

export class MovieService {
  private http = inject(HttpClient);
  private API_URL = `https://www.omdbapi.com/?apikey=${environment.apiKeyOMDb}`;
   // 🔥 Declaramos el Subject para confeti
  public confetti$ = new Subject<void>();

  private _isLoading = signal<boolean>(false);
  public isLoading = this._isLoading.asReadonly();

  public totalResults = computed(() => this._movies().length);
  public totalPeliculas = () => this._movies().length;

  private _movies = signal<Movie[]>([]);
  public movies = this._movies.asReadonly();

  private _currentMovie = signal<Movie | null>(null);
  public currentMovie = this._currentMovie.asReadonly();

  private _favorites = signal<Movie[]>([]);
  public favorites = this._favorites.asReadonly();

  public totalFavorites =  computed(() => this._favorites().length);

  toggleFavorite(movie: Movie) {
    const current = this._favorites();
    const exists = current.find(m => m.imdbID === movie.imdbID);
    if(exists){
      // Elimino de favoritos
      this._favorites.set(current.filter(m => m.imdbID !== movie.imdbID));
    } else {
      //Añado a favoritos
      this._favorites.set([...current, movie]);
      this.confetti$.next();
    }
  }
  
  getFavorites() {
      return this._favorites();
  }

  isFavorite(id: string): boolean {
    return this._favorites().some(m => m.imdbID === id);
  }
  
  searchMovies(title: string) {
    this._isLoading.set(true);
    this.http.get<OMDbResponse>(`${this.API_URL}&s=${title}`)
      .subscribe(response => {
        if (response.Response === 'True') {
          this._movies.set(response.Search);
        } else {
          this._movies.set([]);
        }
        this._isLoading.set(false);
      });    
  }

  getMovieDetails(imdbID: string) {
     this._isLoading.set(true);
      this.http.get<Movie>(`${this.API_URL}&i=${imdbID}`)
        .subscribe(movie => {
          this._currentMovie.set(movie);
             this._isLoading.set(false);  
        });
  }

  /**
   * Limpia el Signal de película seleccionada.
   * Se usa para evitar mostrar datos antiguos antes de cargar una nueva película.
   */
  clearCurrentMovie() {
    this._currentMovie.set(null);
  }

  // Devuelve un array de nombres de iconos de estrellas según la calificación
  getStars(movie: Movie): string[] {
    if (!movie.imdbRating) return ['star-outline','star-outline','star-outline','star-outline','star-outline'];
    const rating = parseFloat(movie.imdbRating);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i * 2) {
        stars.push('star');
      } else if (rating >= (i * 2) - 1) {
        stars.push('star-half');
      } else {
        stars.push('star-outline');
      }
    }
    return stars;
  }

  clearMovies() {
    this._movies.set([]);
  }
}
