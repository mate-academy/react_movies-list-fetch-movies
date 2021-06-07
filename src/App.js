import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';
import { request } from './api/api';

export const App = () => {
  const [movies, setMovies] = useState(data);
  const [query, setQuery] = useState('');
  const [film, findFilm] = useState(0);
  const [error, findError] = useState(false);

  const handleSearch = () => {
    request(query)
      .then((result) => {
        if (result.Response === 'False') {
          return findError(true);
        }

        return findFilm(result);
      });
  };

  const handleChange = (event) => {
    setQuery(event.target.value);
    findError(false);
  };

  const addFilm = (movie) => {
    if (movies.some(cinema => cinema.imdbId === movie.imdbID) === true) {
      setQuery('');
    } else {
      const { Title, Plot, Poster, imdbID } = movie;
      const result = {
        title: Title,
        description: Plot,
        imgUrl: Poster,
        imdbUrl: `https://www.imdb.com/title/${imdbID}`,
        imdbId: imdbID,
      };

      setMovies(array => [...array, result]);
      setQuery('');
    }
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
          film={film}
          setQuery={setQuery}
          query={query}
          handleSearch={handleSearch}
          error={error}
          handleChange={handleChange}
          addFilm={addFilm}
        />
      </div>
    </div>
  );
};
