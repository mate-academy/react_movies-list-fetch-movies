import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';
import { request } from '../../api';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovieToTheList }) => {
  const [nameOfMovie, setNameOfMovie] = useState('');
  const [movieFound, setMovieFound] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  async function getMovie() {
    const resultMovie = await request(nameOfMovie);

    createMovie(resultMovie);
  }

  const createMovie = ({ Title, Plot, Poster, imdbID }) => {
    if (Title === undefined) {
      setMovieFound(null);
      setShowMessage(true);

      return;
    }

    const newMovie = {
      title: Title,
      description: Plot,
      imgUrl: Poster,
      imdbUrl: `https://www.imdb.com/title/${imdbID}`,
      imdbId: imdbID,
    };

    setMovieFound(newMovie);
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
              className={
                !showMessage
                  ? 'input'
                  : 'input is-danger'
              }
              value={nameOfMovie}
              onChange={((event) => {
                setNameOfMovie(event.target.value);
                setShowMessage(false);
              })}
            />
          </div>
          {!showMessage
            ? null
            : (
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
              onClick={getMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={(() => {
                addMovieToTheList(movieFound);
                setNameOfMovie('');
              })}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movieFound
          ? <MovieCard {...movieFound} />
          : null}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovieToTheList: PropTypes.func.isRequired,
};
