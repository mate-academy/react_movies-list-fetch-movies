import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieFound, setMovieFound] = useState<Movie | null>(null);

  const addMovie = (movie: Movie) => {
    if (!movies.find(film => film.imdbId === movie.imdbId)) {
      setMovies([...movies, movie]);
    }

    setMovieFound(null);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
          movieFound={movieFound}
          setMovieFound={setMovieFound}
        />
      </div>
    </div>
  );
};
