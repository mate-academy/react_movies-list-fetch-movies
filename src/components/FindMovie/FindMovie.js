import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { movieRequest } from '../../api/movieRequest';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie }) => {
  const [value, setValue] = useState('');
  const [currentMovie, setMovie] = useState(null);
  const [error, setError] = useState('');

  const getFilmInfo = async() => {
    const movie = {};

    await movieRequest(value)
      .then((response) => {
        movie.error = response.Error;
        movie.title = response.Title;
        movie.description = response.Plot;
        movie.imgUrl = response.Poster;
        movie.imdbUrl = `https://www.imdb.com/title/${response.imdbId}`;
        movie.imdbId = response.imdbID;
      });

    if (movie.error) {
      return setError(movie.error);
    }

    return setMovie(movie);
  };

  const changeInputTitle = ({ target }) => {
    setError('');
    setValue(target.value);
  };

  const newMovie = () => {
    if (currentMovie && addMovie(currentMovie)) {
      setMovie(null);
      setValue('');
    } else {
      setError('no corect film');
    }
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${error && 'is-danger'}`}
              value={value}
              onChange={changeInputTitle}
            />
          </div>

          <p className="help is-danger">
            {error || ''}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={getFilmInfo}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={newMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {currentMovie && <MovieCard {...currentMovie} />}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
