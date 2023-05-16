import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovie] = useState<Movie[]>([]);

  const handleAddMovie = (newMovie: Movie) => {
    const isMovieExist = movies.some(movie => movie.imdbId === newMovie.imdbId);

    if (isMovieExist) {
      return movies;
    }

    return setMovie(currentMovie => [...currentMovie, newMovie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAddMovie={handleAddMovie} />
      </div>
    </div>
  );
};
