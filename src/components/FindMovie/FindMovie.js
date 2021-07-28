import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

const api = `https://www.omdbapi.com/?apikey=53f175f9&t=`;

export const FindMovie = ({ onClick }) => {
  const [value, setValue] = useState('');
  const [newMovie, setNewMovie] = useState(null);
  const [titleValidation, setTitleValidation] = useState(true);
  const [isMovie, setIsMovie] = useState(false);

  const changeValueAndValidation = (newValue) => {
    setValue(newValue);
    setTitleValidation(true);
  };

  const addMovie = () => {
    onClick(newMovie);
    setValue('');
    setNewMovie(null);
    setIsMovie(false);
  };

  const findMovie = async() => {
    try {
      const response = await fetch(api + value);
      const movie = await response.json();

      if (movie.Response === 'True') {
        setNewMovie({
          title: movie.Title,
          description: movie.Plot,
          imgUrl: movie.Poster,
          imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
          imdbId: movie.imdbID,
        });
        setIsMovie(true);
      } else {
        setTitleValidation(false);
      }
    } catch {
      return 'ERROR';
    }

    return 'all working';
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
              onChange={({ target }) => changeValueAndValidation(target.value)}
              value={value}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
            />
          </div>

          {!titleValidation
            && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
            )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              onClick={findMovie}
              type="button"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              disabled={!isMovie}
              onClick={addMovie}
              type="button"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      {newMovie
        && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard
            {...newMovie}
          />
        </div>
        )}

    </>
  );
};

FindMovie.propTypes = {
  onClick: PropTypes.func.isRequired,
};
