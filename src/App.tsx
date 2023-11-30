import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);

  const addMovie = (newMovie: Movie | null) => {
    const uniqueMovie = movies.find(item => item.imdbId === newMovie?.imdbId);

    if (newMovie && !uniqueMovie) {
      setMovies((prevMovies) => [...prevMovies, newMovie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          movie={movie}
          setMovie={setMovie}
          addMovie={addMovie}
        />
      </div>
    </div>
  );
};
