import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';
import { fetchMovie } from '../../api/Api';

export const FindMovie = ({ addNewMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const getMovie = () => {
    fetchMovie(title)
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
          imdbUrl: `https://www.imdb.com/title/${movieFromApi.imdbID}`,
          imdbId: movieFromApi.imdbID,
        });
      });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(e) => {
          e.preventDefault();

          return getMovie();
        }}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setNotFound(false);
              }}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': notFound })}
              autoComplete="off"
            />
          </div>

          {notFound && (
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
              onClick={getMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                if (movie) {
                  addNewMovie(movie);
                  setTitle('');
                  setMovie(null);
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>

        {movie && (
          <MovieCard {...movie} />
        )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addNewMovie: PropTypes.func.isRequired,
};
