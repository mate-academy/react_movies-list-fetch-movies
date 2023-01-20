import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isMovieInTheList, setIsMovieInTheList] = useState(false);

  const onAdd = (movie: Movie) => {
    setMovies((prevMovies) => {
      const isMovieAdded = prevMovies.some((film => (
        film.imdbId === movie.imdbId
      )));

      if (isMovieAdded) {
        setIsMovieInTheList(true);

        return prevMovies;
      }

      return [
        ...prevMovies,
        movie,
      ];
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie isMovieInTheList={isMovieInTheList} onAdd={onAdd} />
      </div>
    </div>
  );
};
