import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';

const BASE_URL = 'https://www.omdbapi.com/?apikey=8b940388';

export const FindMovie = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState(null);
  const [isMovieFined, setIsMovieFined] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleClick = async() => {
    const movieFromServer = await fetch(`${BASE_URL}&t=${title}`)
      .then(response => response.json());

    if (movieFromServer.Response === 'False') {
      setIsMovieFined(false);
      setLoading(false);

      return;
    }

    const searchedMovie = {
      title: movieFromServer.Title,
      description: movieFromServer.Plot,
      imgUrl: movieFromServer.Poster,
      imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}`,
      imdbId: movieFromServer.imdbID,
    };

    setMovie(searchedMovie);
    setIsMovieFined(true);
    setLoading(false);
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
              value={title}
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': !isMovieFined })}
              onChange={(event) => {
                setTitle(event.target.value);
                setIsMovieFined(true);
              }}
            />
          </div>
          {!isMovieFined && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              onClick={() => {
                handleClick();
                setLoading(true);
              }}
              className="button btn-light"
            >
              {loading && (
              <span
                className="spinner-grow spinner-grow-sm"
                role="status"
                aria-hidden="true"
              />
              )}
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              disabled={!movie}
              onClick={() => {
                addMovie(movie);
                setTitle('');
                setMovie(null);
                setIsMovieFined(true);
              }}
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && (
        <MovieCard {...movie} />
        )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
