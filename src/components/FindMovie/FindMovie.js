import React, { useState } from 'react';
import PropTypes, { string } from 'prop-types';

import { getMovie } from '../../api/api';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import movies from '../../api/movies.json';

// const moviesTitle = movies.map(movie => movie.title);

export const FindMovie = ({ moviesIdList, addMovie }) => {
  const [inputValue, setInputValue] = useState('');
  const [searchError, setSearchError] = useState(false);
  const [movie, setMovie] = useState(movies[0]);
  const [moviesId] = useState(moviesIdList);

  const inputValueHandler = (event) => {
    setInputValue(event.target.value);
    if (searchError) {
      setSearchError(false);
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();

    getMovie(inputValue)
      .then((response) => {
        if (response.Response === 'False') {
          throw new Error();
        }

        return response;
      })
      .then((film) => {
        if (moviesId.includes(film.imdbID)) {
          setMovie('The movie has already exist');

          return 'The movie has already exist';
        }

        const newMovie = {
          title: film.Title,
          description: film.Plot,
          imgUrl: film.Poster,
          imdbUrl: `https://www.imdb.com/title/${film.imdbID}`,
          imdbId: film.imdbID,
        };

        setMovie(newMovie);

        return film;
      })
      .catch(() => {
        setSearchError(true);
      });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={submitHandler}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
              value={inputValue}
              onChange={inputValueHandler}
            />
          </div>

          {searchError && (
          <p className="help is-danger">
            Can&apos;t find a movie with such a title
          </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => addMovie(movie)}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {typeof movie === 'string' && <p>{movie}</p>}
        {typeof movie === 'object' && <MovieCard {...movie} />}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
  moviesIdList: PropTypes.arrayOf(string).isRequired,
};
