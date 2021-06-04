import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

import { getData } from '../../Api';

export const FindMovie = ({ onMovies }) => {
  const [value, setValue] = useState('');
  const [errorFind, setError] = useState(false);
  const [previewMovie, setMovie] = useState(null);

  const getFilm = () => {
    getData(value)
      .then((data) => {
        if (data.Response === 'False') {
          return setError(true);
        }

        const {
          Title,
          Plot,
          Poster,
          imdbID,
        } = data;

        const newMovie = {
          title: Title,
          description: Plot,
          imgUrl: Poster,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        };

        return setMovie(newMovie);
      });
  };

  const handleChange = (event) => {
    setValue(event.target.value);
    setError(false);
  };

  const handlerSubmit = (event) => {
    event.preventDefault();
    onMovies(previewMovie);

    setValue('');
    setError(false);
    setMovie(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handlerSubmit}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              value={value}
              placeholder="Enter a title to search"
              className={classNames({
                input: true,
                'is-danger': errorFind,
              })}
              onChange={handleChange}
            />
          </div>

          {errorFind
          && (
          <p className="help is-danger">
            Can&apos;t find a movie with such a title
          </p>
          )
        }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={getFilm}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {previewMovie
      && (
      <div className="container">
        <h2 className="title">Preview</h2>
        <MovieCard {...previewMovie} />
      </div>
      )
    }
    </>
  );
};

FindMovie.propTypes = {
  onMovies: PropTypes.func.isRequired,
};
