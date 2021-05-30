import React, { useCallback, useEffect, useState } from 'react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovieByTitle } from '../../api/api';

const imagePlug = '';

export const FindMovie = ({ addMovie }) => {
  const [targetTitle, setSearchQuery] = useState('');
  const [movie, setMovie] = useState(null);
  const [isError, setIsError] = useState(false);
  const [canAddMovie, setCanAddMovie] = useState(false);

  useEffect(() => {
    setCanAddMovie(movie !== null);
  }, [movie]);

  const findMovie = useCallback(() => {
    getMovieByTitle(targetTitle).then((data) => {
      let newMovie;

      if (data.Response === 'True') {
        newMovie = {
          title: data.Title || 'no title',
          description: data.Plot || 'no description',
          imgUrl: data.Poster || imagePlug,
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          imdbId: data.imdbID,
        };
      } else {
        newMovie = null;
        setIsError(true);
      }

      setMovie(newMovie);
    });
  });

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          addMovie(movie);
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
              className={ClassNames({
                input: true,
                'is-danger': isError,
              })}
              value={targetTitle}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setIsError(false);
              }}
            />
          </div>

          <p className={ClassNames({
            help: true,
            'is-danger': isError,
            'find-movie__error-message': true,
            'find-movie__error-message--is-hidden': !isError,
          })}
          >
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
              type="submit"
              className="button is-primary"
              disabled={!canAddMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie !== null && (
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
