import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies] = useState<Movie[]>([]);

  const pushMovie = (movie: Movie | null) => {
    if (!movie) {
      return;
    }

    movies.push(movie);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          addMovie={pushMovie}
        />
      </div>
    </div>
  );
};
