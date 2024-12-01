import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

const movieAlreadyInTheList = (movies: Movie[], newMovie: Movie) => {
  return movies.some(movie => movie.imdbId === newMovie.imdbId);
};

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddtoTheList = (newMovie: Movie) => {
    if (!movieAlreadyInTheList(movies, newMovie)) {
      setMovies([
        ...movies,
        newMovie,
      ]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAddToTheList={handleAddtoTheList} />
      </div>
    </div>
  );
};
