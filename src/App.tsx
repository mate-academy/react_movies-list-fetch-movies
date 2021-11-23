import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [moviesStack, setMoviesStack] = useState<Movie[]>([]);

  const isEqualMovieExist = (movie: Movie) => {
    return moviesStack.some(currentMovie => currentMovie.imdbID === movie.imdbID);
  };

  const addMovieToList = (movie?: Movie): void => {
    if (movie && !isEqualMovieExist(movie)) {
      setMoviesStack((movies) => [...movies, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={moviesStack} />
      </div>
      <div className="sidebar">
        <FindMovie onAdd={addMovieToList} />
      </div>
    </div>
  );
};
