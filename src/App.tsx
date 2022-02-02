import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovieToList = (movie: Movie) => {
    if (!movies.some(currMovie => currMovie.imdbID === movie.imdbID)) {
      setMovies(current => [...current, movie]);
    }
  };

  return (
    <div className="App">
      <div className="page">
        <div className="page-content">
          {movies.length > 0 && (
            <MoviesList movies={movies} />
          )}
        </div>
        <div className="sidebar">
          <FindMovie onAdd={addMovieToList} />
        </div>
      </div>
    </div>
  );
};
