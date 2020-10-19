/* eslint-disable no-prototype-builtins */
import React, { useState } from 'react';
import './FindMovie.scss';

import PropTypes from 'prop-types';

import classNames from 'classnames';
import { PreviewMovie } from '../PreviewMovie';

// eslint-disable-next-line arrow-body-style
export const FindMovie = ({ addFilm, movies }) => {
  const url = 'http://www.omdbapi.com/?apikey=c00fb1b5&t=';
  const [title, setTitle] = useState('');
  const [filmInfo, setFilmInfo] = useState({});

  const handleTitle = (event) => {
    const { value } = event.target;

    setTitle(value);
  };

  const findFilm = () => {
    fetch(`${url}${title}`)
      .then(response => response.json())
      .then(info => setFilmInfo(info));
  };

  const addMovieToList = () => {
    if (!filmInfo.hasOwnProperty('Title')
      || movies.some(movie => movie.title === filmInfo.Title)) {
      return;
    }

    const newMovie = {
      title: filmInfo.Title,
      description: filmInfo.Plot,
      imgUrl: filmInfo.Poster,
      imdbUrl: 'https://www.imdb.com/',
      imdbId: `${Math.random() * 100}`,
    };

    addFilm(newMovie);
    setTitle('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          findFilm();
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
              className={classNames('input', {
                'is-danger': filmInfo.hasOwnProperty('Error'),
              })}
              name="title"
              value={title}
              onChange={handleTitle}
            />
          </div>

          {filmInfo.hasOwnProperty('Error') && (
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
              onClick={findFilm}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addMovieToList}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {filmInfo.hasOwnProperty('Title') && (
          <PreviewMovie {...filmInfo} />
        )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addFilm: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf(
    PropTypes.object,
  ).isRequired,
};
