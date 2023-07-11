import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddMovie = (movie: Movie) => {
    setMovies(prevState => {
      const movieExist = prevState.find(state => state.imdbId === movie.imdbId);

      return movieExist ? prevState : [
        ...prevState,
        movie,
      ];
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie handleAddMovie={handleAddMovie} />
      </div>
    </div>
  );
};
