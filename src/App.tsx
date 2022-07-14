import { FC, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddMovie = (newMovie: Movie | null) => {
    if (newMovie) {
      const movieToAdd = movies.find(
        (movie: Movie) => movie.imdbID === newMovie.imdbID,
      );

      if (!movieToAdd) {
        setMovies(
          [...movies, newMovie],
        );
      }
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        { movies && <MoviesList movies={movies} /> }
      </div>
      <div className="sidebar">
        <FindMovie onAddMovie={handleAddMovie} />
      </div>
    </div>
  );
};
