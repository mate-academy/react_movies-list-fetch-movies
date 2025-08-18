import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { useState } from 'react';

export const App = () => {
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');

  const handleInputOnChange = (inputValue: string) => {
    setQuery(inputValue);
  };

  const handleSearchMovie = (movie: Movie | null) => {
    setCurrentMovie(movie);
  };

  const handleAddMovie = () => {
    if (!currentMovie) {
      return;
    }

    const isMovieAlreadyAdded = movies.find(
      movie => movie.id === currentMovie.id,
    );

    if (!isMovieAlreadyAdded) {
      setMovies(prevMovies => [...prevMovies, currentMovie]);
    }

    setCurrentMovie(null);
    setQuery('');
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
