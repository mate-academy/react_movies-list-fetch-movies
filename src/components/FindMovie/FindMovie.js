import React, { useState } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/fetchData';

export const FindMovie = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const fetchMovie = () => {
    getMovie(title)
      .then((movieFromApi) => {
        if (movieFromApi.Response === 'False') {
          setNotFound(true);

          return;
        }

        setNotFound(false);

        setMovie({
          title: movieFromApi.Title,
          description: movieFromApi.Plot,
          imgUrl: movieFromApi.Poster,
          imdbUrl: `https://www.imdb.com/title/${movieFromApi.imdbID}/`,
          imdbId: movieFromApi.imdbID,
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
              onChange={(event) => {
                setTitle(event.target.value);
                setNotFound(false);
              }}
              value={title}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', {
                'is-danger': notFound,
              })}
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
              onClick={fetchMovie}
              type="button"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              onClick={() => {
                addMovie(movie);
                setTitle('');
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
