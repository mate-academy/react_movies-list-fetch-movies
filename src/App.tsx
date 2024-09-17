import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddMovies = (movie: Movie) => {
    const exist = movies.find(el => el.imdbId === movie.imdbId);

    if (!exist) {
      setMovies(prev => [...prev, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        {movies.length > 0 && <MoviesList movies={movies} />}
      </div>

      <div className="sidebar">
        <FindMovie addMovie={handleAddMovies} />
      </div>
    </div>
  );
};
