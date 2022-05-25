import './App.scss';
import { useCallback, useState } from 'react';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = useCallback((newMovie: Movie) => {
    if (!movies.some(film => film.imdbID === newMovie.imdbID)) {
      setMovies([...movies, newMovie]);
    } else {
      // eslint-disable-next-line no-alert
      alert('This movie was selected');
    }
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        {movies && <MoviesList movies={movies} />}
      </div>
      <div className="sidebar">
        <FindMovie addMovie={addMovie} />
      </div>
    </div>
  );
};
