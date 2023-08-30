import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const checkDublicate = (movie: Movie): Movie[] => {
    return movies.find(item => item.imdbId === movie.imdbId)
      ? movies
      : [...movies, movie];
  };

  const addMovieToTheList = (movie: Movie) => {
    setMovies(checkDublicate(movie));
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAdd={addMovieToTheList} />
      </div>
    </div>
  );
};
