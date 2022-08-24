import { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovieToList = useCallback((movie: Movie) => {
    const isInList = movies.every(film => film.imdbId !== movie.imdbId);

    if (isInList) {
      setMovies(list => [...list, movie]);
    }
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onClickAdd={addMovieToList} />
      </div>
    </div>
  );
};
