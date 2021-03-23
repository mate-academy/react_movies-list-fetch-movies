import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export const FindMovie = ({ addMovie, movies }) => {
  const [input, setInput] = useState('');
  const [movie, setMovie] = useState(null);
  const [movieIsNotFound, setStatus] = useState(false);

  function findMovieByTitle(event) {
    event.preventDefault();
    getMovie(input)
      .then((result) => {
        try {
          setMovie({
            title: result.Title,
            description: result.Plot,
            imdbId: result.imdbID,
            imgUrl: result.Poster,
            imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
          });
          setStatus(false);
        } catch {
          setStatus(true);
        }
      });
  }

  function addNewMovie() {
    if (!movies.find(film => film.imdbId === movie.imdbId)
      && !movieIsNotFound
      && movie
    ) {
      addMovie([...movies, movie]);
      setInput('');
      setMovie(null);
    }
  }

  function changeValue(event) {
    const { value } = event.target;

    setStatus(false);
    setInput(value);
  }

  return (
    <>
      <form className="find-movie" onSubmit={findMovieByTitle}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              value={input}
              onChange={changeValue}
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': movieIsNotFound })}
            />
          </div>

          {movieIsNotFound
        && (
        <p className="help is-danger">
          Can&apos;t find a movie with such a title
        </p>
        )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addNewMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {!movieIsNotFound && movie
      && (
      <MovieCard {...movie} />
      )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      imdbId: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};
