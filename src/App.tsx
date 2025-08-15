import { useEffect, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const [debounceQuery, setDebounceQuery] = useState(query);

  // useEffect({}, []);

  const handleInputOnChange = (inputValue: string) => {
    setQuery(inputValue);
  };

  const handleSearchMovie = (movie: Movie | null) => {
    setCurrentMovie(movie);
  };

  const handleAddMovie = () => {
    if (currentMovie) {
      setMovies(prevMovies => [...prevMovies, currentMovie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          movie={currentMovie}
          query={query}
          onChange={handleInputOnChange}
          onSearch={handleSearchMovie}
          onAdd={handleAddMovie}
        />
      </div>
    </div>
  );
};
