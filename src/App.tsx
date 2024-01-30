import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (movie: Movie) => {
    if (movies.some(m => m.imdbId === movie.imdbId)) {
      return;
    }

    setMovies([...movies, movie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        {/* лист відображення мого листа */}
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        {/* пошук на сервері та додавання до мого листа */}
        <FindMovie addMovieToList={addMovie} />
      </div>
    </div>
  );
};
