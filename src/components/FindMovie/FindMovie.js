import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';

import { getMovie } from '../../api/api';

export const FindMovie = ({ movies, setMovies }) => {
  const [movie, setMovie] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [searchError, setSearchError] = useState(false);

  const handleInput = (event) => {
    const { value } = event.target;

    setInputValue(value);

    setSearchError(false);
  };

  const handleSearh = async() => {
    const data = await getMovie(inputValue);

    try {
      if (data.Response === 'False') {
        setMovie(null);
        setSearchError(true);

        return;
      }

      setMovie({
        title: data.Title,
        description: data.Plot,
        imgUrl: data.Poster,
        imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
        imdbId: data.imdbID,
      });
    } catch (error) {
      setSearchError('Connection not founded');
    }
  };

  const addMovie = () => {
    setInputValue('');
    setMovie(null);

    if (movie) {
      if (movies.every(film => film.imdbId !== movie.imdbId)) {
        setMovies([...movies, movie]);
      }
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          handleSearh();
        }}
      >
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
              className={cn(
                'input', { 'is-danger': searchError },
              )}
              onChange={event => handleInput(event)}
            />
          </div>

          <p className="help is-danger">
            {searchError && `Can't find a movie with such a title`}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              onSubmit={handleSearh}
              type="submit"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              onClick={addMovie}
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

FindMovie.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.shape(PropTypes.string)),
  setMovies: PropTypes.func.isRequired,
};

FindMovie.defaultProps = {
  movies: [],
};
