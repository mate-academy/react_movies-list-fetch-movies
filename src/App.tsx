import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isMovieNew, setIsMovieNew] = useState(true);

  const addMovie = (movie: Movie) => {
    const isExistMovie = movies.find(
      existMovie => existMovie.imdbId === movie.imdbId,
    );

    if (!isExistMovie) {
      setIsMovieNew(true);
      setMovies((prevMovies) => [...prevMovies, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAddMovieBtn={addMovie} thisMovieExist={isMovieNew} />
      </div>
    </div>
  );
};
