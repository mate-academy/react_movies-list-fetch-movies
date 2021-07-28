import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getMovie } from '../../api/api';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const findMovie = () => {
    getMovie(title)
      .then((isMovieFind) => {
        if (isMovieFind.Response === 'False') {
          setNotFound(true);

          return;
        }

        setNotFound(false);

        setMovie({
          title: isMovieFind.Title,
          description: isMovieFind.Plot,
          imgUrl: isMovieFind.Poster,
          imdbUrl: `https://www.imdb.com/title/${isMovieFind.imdbID}/`,
          imdbId: isMovieFind.imdbID,
        });
      });
  };

  return (
    <>
      <form
        className="find-movie"
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
              className="input is-danger"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setNotFound(false);
              }}
            />
          </div>
          {
            notFound && (
              <p className="help is-danger">
                Can&apos;t find a movie with such a title
              </p>
            )
          }
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
              onClick={() => {
                addMovie(movie);
                setMovie(null);
              }}
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
        {
          movie && (
            <MovieCard {...movie} />
          )
        }
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
