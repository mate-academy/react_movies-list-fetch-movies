import { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './react-app-env';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [count, setCount] = useState(0);

  const setMovieHandler = useCallback(
    (movie: Movie) => {
      setMovies([...movies, movie]);
    },
    [movies],
  );

  return (
    <div className="page">
      <div className="page-content">
        <button
          type="button"
          onClick={() => setCount((state) => state + 1)}
        >
          {count}
        </button>
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          movies={movies}
          onSetMovies={setMovieHandler}
        />
      </div>
    </div>
  );
};
