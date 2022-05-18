import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

import { getMovieByTitle } from './api/api';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [titleQuery, setTitleQuery] = useState('');
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);
  const [isFindErrorVisible, setFindErrorVisible] = useState(false);
  const [isMovieRepeat, setMovieRepeat] = useState(false);

  const checkMovieRepeat = (id: string) => {
    return movies.some(movie => movie.imdbID === id);
  };

  const getMovieFromServer = async () => {
    const newMovie = await getMovieByTitle(titleQuery);

    if (newMovie.Response === 'False') {
      setPreviewMovie(null);
      setFindErrorVisible(true);

      return;
    }

    if (checkMovieRepeat(newMovie.Title)) {
      setMovieRepeat(true);

      return;
    }

    setPreviewMovie(newMovie);
    setFindErrorVisible(false);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList
          movies={movies}
        />
      </div>
      <div className="sidebar">
        <FindMovie
          previewMovie={previewMovie}
          setPreviewMovie={setPreviewMovie}
          setMovies={setMovies}
          setTitleQuery={setTitleQuery}
          titleQuery={titleQuery}
          getMovieFromServer={getMovieFromServer}
          isFindErrorVisible={isFindErrorVisible}
          setFindErrorVisible={setFindErrorVisible}
          isMovieRepeat={isMovieRepeat}
          setMovieRepeat={setMovieRepeat}
          checkMovieRepeat={checkMovieRepeat}
        />
      </div>
    </div>
  );
};
