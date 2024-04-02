import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleSubmitMovie = (value: Movie) => {
    const isDuplicate = movies.some(movie => movie.imdbId === value.imdbId);

    if (!isDuplicate) {
      setMovies([...movies, value]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">{<MoviesList movies={movies} />}</div>

      <div className="sidebar">
        <FindMovie onSubmit={handleSubmitMovie} />
      </div>
    </div>
  );
};
