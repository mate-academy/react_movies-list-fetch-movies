import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { useLocalStorage } from './services/useLocalStorage';

export const App = () => {
  const [movies, setMovies] = useLocalStorage<Movie[]>('movies', []);

  const addMovie = (newMovie: Movie) => {
    setMovies(currentMovies => {
      const isAdded = currentMovies.some(
        movie => movie.imdbId === newMovie.imdbId,
      );

      return isAdded ? currentMovies : [...currentMovies, newMovie];
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addMovie={addMovie} />
      </div>
    </div>
  );
};
