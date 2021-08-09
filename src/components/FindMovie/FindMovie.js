import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

export const FindMovie = ({ addMovie }) => {
  const [inputValue, setInputValue] = useState('');
  const [movie, setMovie] = useState(null);
  const [isFound, setIsFound] = useState(null);

  const addToMovieList = (event) => {
    event.preventDefault();

    addMovie(movie);
    setMovie(null);
  };

  const setMovieFromServer = async() => {
    const movieFromServer = await getMovie(inputValue);

    if (!movieFromServer.Title) {
      setIsFound(false);
      setMovie(null);

      return;
    }

    setMovie({
      title: movieFromServer.Title,
      description: movieFromServer.Plot,
      imgUrl: movieFromServer.Poster,
      imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}`,
      imdbId: movieFromServer.imdbID,
    });
    setIsFound(true);

    setInputValue('');
  };

  return (
    <>
      <form onSubmit={addToMovieList} className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={inputValue}
              onChange={(event) => {
                setInputValue(event.target.value);
                setIsFound(null);
              }}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': isFound === false,
              })}
            />
          </div>

          {isFound === false && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              onClick={() => setMovieFromServer()}
              className="button is-light"
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
      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...movie} />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
