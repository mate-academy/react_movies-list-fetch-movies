import { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddMovie = useCallback(
    (movie: Movie) => {
      const alreadyAdded = movies.find(addedMovie => (
        addedMovie.imdbId === movie.imdbId
      ));

      if (!alreadyAdded) {
        setMovies(prev => [...prev, movie]);
      }
    },
    [movies],
  );

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAddMovie={handleAddMovie} />
      </div>
    </div>
  );
};
