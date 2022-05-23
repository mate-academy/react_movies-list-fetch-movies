import { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [repeat, setRepeat] = useState(false);

  const addMovies = useCallback((movie: Movie) => {
    const duplicate = movies.find(({ imdbID }) => imdbID === movie.imdbID);

    if (!duplicate) {
      setMovies((state) => [...state, movie]);
    } else {
      setRepeat(true);
    }
  }, [movies]);

  const handleRepeat = () => {
    setRepeat(false);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovies={addMovies}
          repeat={repeat}
          handleRepeat={handleRepeat}
        />
      </div>
    </div>
  );
};
