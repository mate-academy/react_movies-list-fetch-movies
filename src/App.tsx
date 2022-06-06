import React, { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Modal } from './components/Modal/Modal';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  const addMovie = useCallback((newMovie: Movie) => {
    if (movies.every(movie => movie.imdbID !== newMovie.imdbID)) {
      setMovies(
        [...movies, newMovie],
      );
    } else {
      setIsVisibleModal(true);
    }
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList
          movies={movies}
        />
      </div>

      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
        />
      </div>

      <Modal
        isVisibleModal={isVisibleModal}
        setIsVisibleModal={setIsVisibleModal}
      />
    </div>
  );
};
