import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string>('');

  const addMovie = (movie: Movie) => {
    const currentMovies = movies;

    if (currentMovies.find(currMovie => currMovie.title === movie.title)) {
      setError('A movie with such a title already exists!');

      return;
    }

    setMovies([...currentMovies, movie]);
  };

  const changeError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          error={error}
          onChangeError={changeError}
          onAddMovie={addMovie}
        />
      </div>
    </div>
  );
};
