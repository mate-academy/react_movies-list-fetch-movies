import { useState } from 'react';
import './App.scss';

import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isMovieInList, setIsMovieInList] = useState(false);

  const addMovie = (movie: Movie) => {
    setMovies(moviesList => {
      if (!moviesList.every(film => film.imdbId !== movie.imdbId)) {
        setIsMovieInList(true);

        return moviesList;
      }

      return [
        ...moviesList,
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
        <FindMovie
          onAddMovie={addMovie}
          isInList={isMovieInList}
          onSetInList={setIsMovieInList}
        />
      </div>
    </div>
  );
};
