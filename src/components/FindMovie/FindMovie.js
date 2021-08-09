import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';

const BASE_URL = 'https://www.omdbapi.com/?apikey=2141309e&t=';

export const FindMovie = ({ onMovieAdd }) => {
  const [title, onTitleChange] = useState('');
  const [film, prepareFilm] = useState(null);
  const [isFilmFound, onFilmFound] = useState(null);
  const [isLoading, onLoading] = useState(false);
  const [isLoaded, onLoadingSuccess] = useState(null);
  const getFilm = async() => {
    onLoading(true);
    const searchResult = await fetch(BASE_URL + title)
      .then(response => response.json())
      .then(result => result);

    if (searchResult.Response === 'False') {
      onFilmFound(false);
      onLoading(false);
      onLoadingSuccess(false);

      return;
    }

    const preparedFilm = {
      title: searchResult.Title,
      description: searchResult.Plot,
      imgUrl: searchResult.Poster,
      imdbUrl: `https://www.imdb.com/title/${searchResult.imdbID}`,
      imdbId: searchResult.imdbID,
    };

    prepareFilm(preparedFilm);
    onFilmFound(true);
    onLoading(false);
    onLoadingSuccess(true);
  };

  const addFilm = () => {
    onMovieAdd(film);
    onTitleChange('');
    onFilmFound(null);
    prepareFilm(null);
    onLoadingSuccess(null);
  };

  const inputClass = classNames({
    input: true,
    'is-danger': isFilmFound === false,
    'is-success': isFilmFound === true,
  });

  const searchButtonClass = classNames({
    button: true,
    'is-light': isLoaded === null,
    'is-success': isLoaded === true,
    'is-danger': isLoaded === false,
    'is-loading': isLoading,
  });

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
              className={inputClass}
              value={title}
              onChange={(event) => {
                onTitleChange(event.target.value);
                onFilmFound(null);
                onLoadingSuccess(null);
              }}
            />
          </div>
          {isFilmFound === false && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>
        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className={searchButtonClass}
              onClick={getFilm}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={!isFilmFound}
              onClick={addFilm}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {isFilmFound && <MovieCard {...film} />}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  onMovieAdd: PropTypes.func.isRequired,
};
