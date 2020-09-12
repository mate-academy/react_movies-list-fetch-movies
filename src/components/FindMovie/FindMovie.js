import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import * as movieAPI from '../../api/api';

export const FindMovie = ({ setMovies, movies }) => {
  const [inputValue, setValue] = useState('');
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(false);

  const handleInputChange = (event) => {
    const { value } = event.target;

    setValue(value);

    setError(false);
  };

  const handleMovieFind = async() => {
    const response = await movieAPI.getMovie(inputValue);

    if (response.Response === 'False') {
      setError(true);
    } else {
      setMovie({
        title: response.Title,
        description: response.Plot,
        imgUrl: response.Poster,
        imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
        imdbId: response.imdbID,
      });
    }
  };

  const handleMovieAddition = () => {
    setValue('');

    if (movie) {
      const match = movies.find(film => film.imdbId === movie.imdbId);

      if (!match) {
        setMovies([...movies, movie]);
      }
    }
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
              value={inputValue}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': error })}
              onChange={((event) => {
                handleInputChange(event);
              })}
            />
          </div>

          <p className="help is-danger">
            {error && `Can't find a movie with such a title`}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              onClick={handleMovieFind}
              type="button"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              onClick={handleMovieAddition}
              type="button"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && <MovieCard {...movie} />}
      </div>
    </>
  );
};

FindMovie.defaultProps = {
  movies: [],
};

FindMovie.propTypes = {
  setMovies: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf(PropTypes.shape(PropTypes.string)),
};
