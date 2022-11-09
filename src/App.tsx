import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');

  const addMovie = (movie: Movie) => {
    const movieIsExist = movies.find(elem => elem.imdbId === movie.imdbId);

    if (!movieIsExist) {
      setMovies(prevMovies => [...prevMovies, movie]);
    }

    setQuery('');
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie query={query} setQuery={setQuery} addMovie={addMovie} />
      </div>
    </div>
  );
};
