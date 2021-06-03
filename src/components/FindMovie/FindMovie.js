import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/getMovies';

export const FindMovie = ({ addNewMovie }) => {
  const [qveryValue, setQveryValue] = useState('');
  const [movie, setMovie] = useState(null);
  const [showMovieCard, setShowMovieCard] = useState(false);
  const [errorMassage, setErrorMassage] = useState('');

  const findMovie = () => {
    getMovie(qveryValue)
      .then((result) => {
        if (result.Response === 'False') {
          setShowMovieCard(false);
          setErrorMassage(result.Error);
          setMovie(null);
          setQveryValue('');

          return;
        }

        const newMovie = {
          title: result.Title,
          description: result.Plot,
          imgUrl: result.Poster,
          imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
          imdbId: result.imdbID,
        };

        setMovie(newMovie);
        setErrorMassage('');
        setShowMovieCard(true);
        setQveryValue('');
      });
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
              value={qveryValue}
              onChange={(event) => {
                setQveryValue(event.target.value);
                setErrorMassage('');
              }}
            />
          </div>

          <p className="help is-danger">
            Can&apos;t find a movie with such a title
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                if (movie !== null) {
                  addNewMovie(movie);
                  setShowMovieCard(false);
                  setMovie(null);
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {showMovieCard ? (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...movie} />
        </div>
      ) : (
        <p>{errorMassage}</p>
      )}
    </>
  );
};

FindMovie.propTypes = {
  addNewMovie: PropTypes.func.isRequired,
};
