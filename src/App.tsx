import { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './libs/types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleSelectMovie = useCallback((selectedMovie: Movie) => {
    const isInMoviesList = movies.some(movie => (
      movie.imdbId === selectedMovie.imdbId
    ));

    if (!isInMoviesList) {
      setMovies([...movies, selectedMovie]);
    }
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onSelectMovie={handleSelectMovie} />
      </div>
    </div>
  );
};
