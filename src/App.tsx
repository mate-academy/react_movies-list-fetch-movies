import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const isEqualMovieExist = (movie: Movie) => {
    return movies.some(currentMovie => currentMovie.imdbID === movie.imdbID);
  };

  const addMovieToList = (movie?: Movie): void => {
    if (movie && !isEqualMovieExist(movie)) {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      setMovies((movies) => movies.concat(movie));
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie onAdd={addMovieToList} />
      </div>
    </div>
  );
};
