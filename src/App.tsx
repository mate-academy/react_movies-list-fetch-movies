import { useCallback, useState } from 'react';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

import './App.scss';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleAddMovie = useCallback(() => {
    const hasMovie = movies.find(({ imdbId }) => imdbId === movie?.imdbId);

    if (movie && !hasMovie) {
      setMovies([...movies, movie]);
      setMovie(null);

      return;
    }

    setMovie(null);
  }, [movie, movies]);

  return (
    <div className="page">
      <div className="page-content">
        {!!movies.length && <MoviesList movies={movies} />}
      </div>

      <div className="sidebar">
        <FindMovie
          movie={movie}
          setMovie={setMovie}
          handleAddMovie={handleAddMovie}
        />
      </div>
    </div>
  );
};
