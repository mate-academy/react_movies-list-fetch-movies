import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');

  const handleAddMovie = (movie: Movie) => {
    const isMovieInList = movies.some(
      existingMovie => existingMovie.imdbId === movie.imdbId,
    );

    if (isMovieInList) {
      alert('This movie is already in the list!');

      return;
    }

    setMovies(prevMovies => [...prevMovies, movie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          onAddMovie={handleAddMovie}
          onQuery={setQuery}
          query={query}
        />
      </div>
    </div>
  );
};
