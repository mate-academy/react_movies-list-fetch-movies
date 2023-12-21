import React from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = React.useState<Movie[]>([]);

  const handleMovies = (movie: Movie) => {
    const dublicates = movies.find(item => item.imdbId === movie.imdbId);

    if (dublicates) {
      return;
    }

    setMovies([
      ...movies,
      movie,
    ]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie giveMovie={handleMovies} />
      </div>
    </div>
  );
};
