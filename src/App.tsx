import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieAdded, setMovieAdded] = useState(false);

  const addMovie = (newMovie: Movie) => {
    if (movies.every(movie => movie.imdbID !== newMovie.imdbID)) {
      setMovies((prev) => [...prev, newMovie]);
      setMovieAdded(false);
    } else {
      setMovieAdded(true);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovie={addMovie} />
        {movieAdded && (
          <p className="help is-danger">
            Movie already added to your list
          </p>
        )}
      </div>
    </div>
  );
};
