import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';
import { findMovieByTitle } from '../../api/api';

import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie }) => {
  const [titleValue, setTitleValue] = useState('');
  const [movie, setMovie] = useState(null);
  const [isMovieFounded, setIsMovieFounded] = useState(true);

  const addFindedMovie = () => {
    addMovie(movie);
    setMovie(null);
  };

  const getMovie = async() => {
    const data = await findMovieByTitle(titleValue);

    const { Title, Plot, Poster, imdbID, Response } = data;

    if (Response === 'False') {
      setIsMovieFounded(false);
      setTitleValue('');
      setMovie(null);

      return;
    }

    setMovie({
      title: Title,
      description: Plot,
      imgUrl: Poster,
      imdbUrl: `https://www.imdb.com/title/${imdbID}`,
      imdbId: imdbID,
    });
    setTitleValue('');
    setIsMovieFounded(true);
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
              className="input is-danger"
              value={titleValue}
              onChange={event => setTitleValue(event.target.value)}
            />
          </div>
          {/[А-Я-Ё]/gi.test(titleValue)
            ? (
              <p className="help is-danger">
                English only
              </p>
            ) : !isMovieFounded && (
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
              onClick={() => getMovie()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => addFindedMovie()}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && (<MovieCard {...movie} />)}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
