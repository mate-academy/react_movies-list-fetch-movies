import React, { useEffect, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';
import { getMovie } from './api';

export const App = () => {
  const [movies, setMovies] = useState([]);
  const [isFound, setIsFound] = useState(true);
  const [searchedMovie, setSearchedMovie] = useState(null);

  useEffect(() => {
    setMovies(data);
  }, []);

  const findMovie = async(query) => {
    const newMovie = await getMovie(query);

    if (newMovie.Response === 'False') {
      setIsFound(false);
      setSearchedMovie(null);

      return;
    }

    setSearchedMovie({
      ...newMovie,
      title: newMovie.Title,
      imdbId: newMovie.imdbID,
      description: newMovie.Plot,
      imgUrl: newMovie.Poster,
    });

    setIsFound(true);
  };

  const addMovie = () => {
    if (!searchedMovie) {
      return;
    }

    if (movies.find(movie => movie.imdbId === searchedMovie.imdbId)) {
      return;
    }

    setMovies(prevState => ([...prevState, searchedMovie]));
    setIsFound(true);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          isFound={isFound}
          searchedMovie={searchedMovie}
          findMovie={findMovie}
          addMovie={addMovie}
          setSearchedMovie={setSearchedMovie}
        />
      </div>
    </div>
  );
};
