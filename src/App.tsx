import { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovieToList = useCallback((movie) => {
    if (movies.every(movieInList => movieInList.imdbId !== movie.imdbId)) {
      setMovies(prevMovies => [...prevMovies, movie]);
    }
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          addMovieToList={addMovieToList}
        />
      </div>
    </div>
  );
};
