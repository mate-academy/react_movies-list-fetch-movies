import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './FindMovie.scss';
import { getConnect } from '../../api/goods';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ onFindFilm }) => {
  const [title, setTitle] = useState('');
  const [film, setFilm] = useState('');
  const [error, setError] = useState(false);

  const findHandlerMovie = (nameFilm) => {
    if (nameFilm === '') {
      return;
    }

    getConnect(nameFilm).then((response) => {
      if (response.Response === 'False') {
        setFilm('');
        setError(true);

        return;
      }

      setFilm({
        title: response.Title,
        description: response.Plot,
        imgUrl: response.Poster,
        imdbUrl: `https://www.imdb.com/title/${response.imdbID}/`,
        imdbId: response.imdbID,
      });

      setTitle('');
      setError(false);
    });
  };

  const addFilmHandler = () => {
    if (!film) {
      return;
    }

    onFindFilm(film);
    setFilm('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          onFindFilm(film);
        }}
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
              className={classNames('input', { 'is-danger': error })}
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            />
          </div>

          {error && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => findHandlerMovie(title)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addFilmHandler}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {film && <MovieCard {...film} />}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  onFindFilm: PropTypes.func.isRequired,
};
