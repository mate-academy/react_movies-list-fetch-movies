import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);

  const reset = () => {
    setTitle('');
    setMovie(null);
  };

  const addMovie = (newMovie: Movie) => {
    if (movies.find(el => el.imdbId === newMovie.imdbId)) {
      reset();

      return;
    }

    setMovies((moviesList) => ([...moviesList, newMovie]));
    reset();
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
          query={title}
          setQuery={setTitle}
          movie={movie}
          setMovie={setMovie}
        />
      </div>
    </div>
  );
};
