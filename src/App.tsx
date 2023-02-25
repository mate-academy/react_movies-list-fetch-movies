import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
// import { curry } from 'cypress/types/lodash';

// import { getMovie } from './api';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');

  const handleQueryChange = (value: string) => {
    setQuery(value);
  };

  const handleAddMovie = (newMovie: Movie) => {
    setMovies(current => (
      [...current.filter((el) => el.imdbId !== newMovie.imdbId), newMovie]
    ));
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          query={query}
          handleQueryChange={handleQueryChange}
          addNewMovie={handleAddMovie}
        />
      </div>
    </div>
  );
};
