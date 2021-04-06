import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';
import ClassNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/findMovieApi';

export const FindMovie = ({ addMovie }) => {
  const [input, setInput] = useState('');
  const [movie, setMovie] = useState(null);
  const [wasMovieFound, setWasMovieFound] = useState(false);
  const [isFindMovie, setIsFindMovie] = useState(false);

  const handleChange = (event) => {
    setInput(event.target.value);
    setIsFindMovie(false);
  };

  const addingMovie = () => {
    getMovie(input).then((response) => {
      if (response.Response === 'False' || input === '') {
        setIsFindMovie(true);
      } else {
        setMovie({
          title: response.Title,
          description: response.Plot,
          imgUrl: response.Poster,
          imdbUrl: 'https://www.imdb.com/title/tt1375666',
          imdbId: response.imdbID,
        });
        setWasMovieFound(true);
        setInput('');
      }
    });
  };

  const addToTheList = () => {
    setWasMovieFound(false);
    addMovie(movie);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => event.preventDefault()}
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
              className={ClassNames('input', { 'is-danger': isFindMovie })}
              value={input}
              onChange={event => handleChange(event)}
            />
          </div>

          {isFindMovie && (
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
              onClick={addingMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addToTheList}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {wasMovieFound && <MovieCard {...movie} />}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
