import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export const FindMovie = ({ addMovie }) => {
  const [movie, setMovie] = useState(null);
  const [title, setTitle] = useState('');
  const [isError, setIsError] = useState(false);

  const findMovie = () => {
    getMovie(title)
      .then((data) => {
        if (data.Response === 'False') {
          setIsError(true);

          return;
        }

        setMovie({
          title: data.Title,
          description: data.Plot,
          imgUrl: data.Poster,
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}/`,
          imdbId: data.imdbID,
        });
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
              className={cn('input', { 'is-danger': isError })}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setMovie(null);
                setIsError(false);
              }}
            />
          </div>

          {isError
            && (
              <p className="help is-danger">
                Can&apos;t find a movie with such a title
              </p>
            )
          }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              className="button is-light"
              type="button"
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie
              && (
                <button
                  className="button is-primary"
                  type="button"
                  onClick={() => {
                    addMovie(movie);
                    setMovie(null);
                    setTitle('');
                  }}
                >
                  Add to the list
                </button>
              )
            }

          </div>
        </div>
      </form>

      <div className="container">

        {movie
          && (
            <>
              <h2 className="title">Preview</h2>
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
};
