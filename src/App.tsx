import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMoviesToList = (newMovie: Movie) => {
    if (movies.some(({ imdbId }) => imdbId === newMovie.imdbId)) {
      return;
    }

    setMovies(prevMovies => (
      [
        ...prevMovies,
        newMovie,
      ]
    ));
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addMoviesToList={addMoviesToList} />
      </div>
    </div>
  );
};
