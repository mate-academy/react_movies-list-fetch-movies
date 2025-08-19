import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addToList = (newMovie: Movie) => {
    const isInList = movies.some(movie => movie.imdbId === newMovie.imdbId);

    if (isInList) {
      movies.filter(movie => movie.imdbId !== newMovie.imdbId);
    } else {
      setMovies([...movies, newMovie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAdd={addToList} />
      </div>
    </div>
  );
};
