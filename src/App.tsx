import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [message, setMessage] = useState('');

  const addMovieToList = (newMovie: Movie) => {
    const index = movies.findIndex(movie => movie.Title === newMovie.Title);

    if (index < 0) {
      setMovies([newMovie, ...movies]);
      setMessage('');
    } else {
      setMessage('This movie was add earlier');
    }
  };

  const correctMessage = (newMessage: string) => {
    setMessage(newMessage);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovieToList={addMovieToList}
          message={message}
          correctMessage={correctMessage}
        />
      </div>
    </div>
  );
};
