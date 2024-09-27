import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

<<<<<<< HEAD
  const addNewMovie = (newMovie: Movie) => {
=======
  const addMovie = (newMovie: Movie) => {
>>>>>>> 1d782fb7aac4cd0d93f39a4aaeb48c98f8a8dc19
    if (movies.some(movie => movie.imdbId === newMovie.imdbId)) {
      return;
    }

    setMovies((currentMovie) => [...currentMovie, newMovie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
<<<<<<< HEAD
        <FindMovie addMovie={addNewMovie} />
=======
        <FindMovie
          addMovie={addMovie}
        />
>>>>>>> 1d782fb7aac4cd0d93f39a4aaeb48c98f8a8dc19
      </div>
    </div>
  );
};
