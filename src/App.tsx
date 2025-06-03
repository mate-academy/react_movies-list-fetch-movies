import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const findMovie = (selectedMovie: Movie) => {
    setMovies(prevList => {
      const exists = prevList.some(
        movie => movie.imdbId === selectedMovie.imdbId,
      );

      return exists ? prevList : [...prevList, selectedMovie];
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie findMovie={findMovie} />
      </div>
    </div>
  );
};
