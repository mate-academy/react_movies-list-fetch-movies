import { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovieToMovies = useCallback(
    (movie:Movie | null) => {
      if (movie) {
        setMovies((prevState) => [...prevState, movie]);
      }
    }, [],
  );

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          movies={movies}
          onAddMovieToList={
            (newMovie:Movie | null) => addMovieToMovies(newMovie)
          }
        />
      </div>
    </div>
  );
};
