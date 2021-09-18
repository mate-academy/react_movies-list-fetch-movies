import './App.scss';
import { useState } from 'react';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

import data from './api/movies.json';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>(data);
  const [isAdded, setAdding] = useState(false);

  const addMovie = (newMovie: Movie) => {
    const isMovieFound = movies.find(movie => movie.imdbId === newMovie.imdbId);

    if (!isMovieFound) {
      setMovies([newMovie, ...movies]);
      setAdding(false);
    } else {
      setAdding(true);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
        />
        {isAdded && (
          <p>
            The movie is already added to the list
          </p>
        )}
      </div>
    </div>
  );
};
