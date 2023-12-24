import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const onMoviesChange = (newMovie: Movie) => {
    const duplicate = movies.find(movie => movie.imdbId === newMovie.imdbId);

    if (duplicate) {
      return;
    }

    setMovies(prevMovies => {
      return [
        ...prevMovies,
        newMovie,
      ];
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          onMoviesChange={onMoviesChange}
        />
      </div>
    </div>
  );
};
