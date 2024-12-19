import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movieList, setMovieList] = useState<Movie[]>([]);

  const handleAddMovie = (newMovie: Movie) => {
    setMovieList(prevState =>
      prevState.some(existingMovie => existingMovie.imdbId === newMovie.imdbId)
        ? prevState
        : [...prevState, newMovie],
    );
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movieList} />
      </div>

      <div className="sidebar">
        <FindMovie onAddMovie={handleAddMovie} />
      </div>
    </div>
  );
};
