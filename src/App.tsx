import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovieAttempt = (movieCandidate: Movie) => {
    if (movies.find(candidate => candidate.imdbId === movieCandidate.imdbId)) {
      return null;
    }

    setMovies(prevState => [...prevState, movieCandidate]);

    return null;
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addMovie={addMovieAttempt} />
      </div>
    </div>
  );
};
