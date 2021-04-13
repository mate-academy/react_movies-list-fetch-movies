import React, { useCallback } from 'react';
import { useLocaleStorage } from './customHooks/useLocaleStorage';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';
import { getMovie } from './api/api';

export const App = () => {
  // const [movies, setMovies] = useState([...data]);
  const [movies, setMovies] = useLocaleStorage('value', [...data]);

  const findMovie = useCallback(async(url) => {
    const movie = await getMovie(url);

    return {
      title: movie.Title,
      description: movie.Plot,
      imgUrl: movie.Poster,
      imdbUrl: movie.ImdbUrl,
      imdbId: movie.imdbID,
    };
  }, []);

  const addMovie = (newMovie) => {
    setMovies([...movies, newMovie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          findMovie={findMovie}
          addMovie={addMovie}
          movies={movies}
        />
      </div>
    </div>
  );
};
