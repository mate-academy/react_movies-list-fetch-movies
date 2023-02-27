import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovieToList = (newMovie: Movie) => {
    const isDuplicate = movies.some(movie => movie.imdbId === newMovie.imdbId);

    if (!isDuplicate) {
      setMovies(list => [...list, newMovie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          onAddMovie={addMovieToList}
        />
      </div>
    </div>
  );
};
