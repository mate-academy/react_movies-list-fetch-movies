import React, { useState, useEffect } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { allMovies } from '../../api/appi';

import { MovieCard } from '../MovieCard';

export const FindMovie = ({ movies, setMovies }) => {
  const [value, setVelue] = useState('');
  const [movie, setMovie] = useState(null);
  const [response, setResponse] = useState(true);
  const [exists, setExists] = useState(false);

  useEffect(() => {
  });

  const findMovie = (event) => {
    event.preventDefault();
    allMovies(value)
      .then(film => (
        film.Response === 'False'
          ? (setResponse(false) && setMovie(null))
          : (
            setMovie({
              title: film.Title,
              description: film.Plot,
              imgUrl: film.Poster,
              imdbUrl: `https://www.imdb.com/title/${film.imdbID}`,
              imdbId: film.imdbID,
              Response: film.Response,
            }),
            setResponse(true)
          )
      ));
  };

  const addMOvie = () => {
    if (movie && !movies.find(film => film.imdbId === movie.imdbId)) {
      setMovies([...movies, movie]);
      setMovie(null);
      setVelue('');
      setExists(false);
    }

    if (movie && movies.find(film => film.imdbId === movie.imdbId)) {
      setExists(true);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={findMovie}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            {`Movie title ${value}`}
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': !response || exists,
              })}
              onChange={({ target }) => {
                setVelue(target.value);
                setResponse(true);
                setExists(false);
              }}
              value={value}

            />
          </div>
          { exists && (
            <p className="help is-danger">
              The movie already exists
            </p>
          )}
          { !response && (
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
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addMOvie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      {movie && movie.title.toLowerCase().includes(value.toLowerCase()) && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard key={movie.imdbId} {...movie} />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      imgUrl: PropTypes.string.isRequired,
      imdbUrl: PropTypes.string.isRequired,
      imdbId: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  setMovies: PropTypes.func.isRequired,
};
