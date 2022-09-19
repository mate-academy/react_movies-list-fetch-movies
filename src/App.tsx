import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [moviesList, setMoviesList] = useState<Movie[]>([]);
  const [sameMovie, setSameMovie] = useState<boolean>(false);

  const toAddMovie = (addMovie: Movie) => {
    if (moviesList.every(movie => movie.imdbID !== addMovie.imdbID)) {
      const newMovies = [...moviesList, addMovie];

      // eslint-disable-next-line no-console
      console.log('added movie to movielist', newMovies);

      setMoviesList(newMovies);
    } else {
      // eslint-disable-next-line no-console
      console.log('there is the same movie');
      setSameMovie(true);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={moviesList} />
      </div>
      <div className="sidebar">
        <FindMovie
          toAddMovie={toAddMovie}
          sameMovie={sameMovie}
          setSameMovie={setSameMovie}
        />
      </div>
    </div>
  );
};
