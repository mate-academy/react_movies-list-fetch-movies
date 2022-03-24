import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addedMovies = (movie: Movie): void => {
    const findedMovie = movies.find(addedMovie => addedMovie.imdbID === movie.imdbID);

    // eslint-disable-next-line no-console
    console.log(movie);

    if (findedMovie === undefined) {
      setMovies([...movies, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addedMovies={addedMovies} />
      </div>
    </div>
  );
};
