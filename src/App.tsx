import { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleOnAdd = useCallback((newMovie: Movie) => {
    const isMovieInList = movies.some(movie => {
      return movie.imdbId === newMovie.imdbId;
    });

    if (isMovieInList) {
      return;
    }

    setMovies([
      ...movies,
      newMovie,
    ]);
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList
          movies={movies}
        />
      </div>

      <div className="sidebar">
        <FindMovie
          onAdd={handleOnAdd}
        />
      </div>
    </div>
  );
};
