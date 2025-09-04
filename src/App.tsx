import { useMemo, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddToList = (pickedMovie: Movie) => {
    setMovies(prev => [...prev, pickedMovie]);
  };

  const moviesTitles = useMemo(() => {
    return movies.map(movie => movie.imdbId);
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          handleAddToList={handleAddToList}
          moviesTitles={moviesTitles}
        />
      </div>
    </div>
  );
};
