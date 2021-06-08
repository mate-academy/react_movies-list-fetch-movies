import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';
import getMovieFromServer from '../../api';

export const FindMovie = ({ addMovie, movies }) => {
  const [movie, setMovie] = useState(null);
  const [Title, setTitle] = useState('');
  const [hasMovie, setHasMovie] = useState(false);
  const [cantFind, setCantFind] = useState(false);

  const handleFindMovie = async() => {
    const newMovie = await getMovieFromServer(Title);

    // eslint-disable-next-line
    if (newMovie.hasOwnProperty('Error')) {
      setHasMovie(false);
      setCantFind(true);

      return;
    }

    setCantFind(false);
    setHasMovie(true);
    setMovie(newMovie);
  };

  const handleAddMovie = () => {
    if (!movie) {
      return;
    }

    if (movies.some(film => film.imdbID === movie.imdbID)) {
      return;
    }

    addMovie(movie);
    setTitle('');
    setMovie(null);
    setHasMovie(false);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <div className="field">
          <label className="label" htmlFor="movie-Title">
            Movie Title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-Title"
              placeholder="Enter a Title to search"
              className={`input ${cantFind && 'is-danger'}`}
              value={Title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            />
          </div>

          {cantFind && (
          <p className="help is-danger">
            Can&apos;t find a movie with such a Title
          </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={handleFindMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleAddMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">

        {hasMovie
          && (
          <>
            <h2 className="Title">Preview</h2>
            <MovieCard {...movie} />
          </>
          )
        }
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
