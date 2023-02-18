import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const addMovie = (newMovie: Movie) => {
    if (!movies.some(movie => movie.imdbId === newMovie.imdbId)) {
      setMovies(currentMovies => [...currentMovies, newMovie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          query={searchQuery}
          setSearchQuery={setSearchQuery}
          addMovie={addMovie}
        />
      </div>
    </div>
  );
};
