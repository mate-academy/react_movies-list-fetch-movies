import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (newMovie: Movie) => {
    const indexNewMovieInMovies = movies.findIndex(
      movie => movie.imdbId === newMovie.imdbId,
    );

    if (indexNewMovieInMovies === -1) {
      setMovies([...movies, newMovie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAddMovie={addMovie} />
      </div>
    </div>
  );
};
