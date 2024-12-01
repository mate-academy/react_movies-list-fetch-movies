import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
// import { getMovie } from './api';
// import { MovieData } from './types/MovieData';
// import { ResponseError } from './types/ReponseError';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [inputValue, setInputValue] = useState('');

  const reset = () => {
    setMovie(null);
    setInputValue('');
  };

  const addMovie = () => {
    setMovies(prevMovies => {
      if (movie !== null) {
        const isAlredyHere = prevMovies.find(
          mov => movie?.imdbId === mov.imdbId,
        );

        if (isAlredyHere) {
          return prevMovies;
        }

        return [...prevMovies, movie];
      }

      return prevMovies;
    });
    reset();
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          value={inputValue}
          onChangeValue={setInputValue}
          movie={movie}
          onChangeMovie={setMovie}
          onAdd={addMovie}
        />
      </div>
    </div>
  );
};
