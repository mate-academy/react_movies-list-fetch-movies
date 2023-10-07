import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddMovies = (movie: Movie): void => {
    const founded = movies.some(({ imdbId }) => imdbId === movie.imdbId);

    if (founded) {
      return;
    }

    setMovies(prevMovies => [...prevMovies, movie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie setMoviesList={handleAddMovies} />
      </div>
    </div>
  );
};
