import { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const addMovie = useCallback((newMovie: Movie) => {
    const isMovieInList = movies
      .some(movie => movie.imdbId === newMovie.imdbId);

    if (!isMovieInList) {
      setMovies(currentMovies => [...currentMovies, newMovie]);
    }
  }, []);

  const changeSearchQuery = useCallback((newQuery: string) => {
    setSearchQuery(newQuery);
  }, []);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          query={searchQuery}
          setSearchQuery={changeSearchQuery}
          addMovie={addMovie}
        />
      </div>
    </div>
  );
};
