import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './FindMovie.scss';

import { getFilm } from '../../helpers';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ setMovies }) => {
  const [newTitle, setTitle] = useState('');
  const [film, setFilm] = useState(null);
  const [hasLoadingError, setLoadingError] = useState(false);
  const [showError, setShowError] = useState(false);

  const findFilm = async() => {
    const newFilm = await getFilm(newTitle);

    if (newFilm.Title) {
      setFilm({
        title: newFilm.Title,
        description: newFilm.Plot,
        imgUrl: newFilm.Poster,
        imdbUrl: newFilm.imdbID,
      });
      setLoadingError(true);
      setShowError(false);
      setTitle('');
    } else {
      setLoadingError(false);
      setShowError(true);
    }
  };

  const setNewMovieToList = () => {
    if (!film) {
      return;
    }

    setMovies(movies => (
      (!movies.some(movie => movie.imdbUrl === film.imdbUrl)
        ? [...movies, film] : movies)
    ));
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          setTitle('');
          setNewMovieToList();
        }
        }
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
              className={classNames('input', { 'is-danger': showError })}
              value={newTitle}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            />
          </div>

          {showError
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
              type="button"
              className="button is-light"
              onClick={
                () => {
                  findFilm();
                }
              }
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">

        {hasLoadingError
        && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard
              title={film.title}
              description={film.description}
              imgUrl={film.imgUrl}
              imdbUrl={film.imdbUrl}
            />
          </>
        )
        }
      </div>
    </>
  );
};

FindMovie.propTypes = {
  setMovies: PropTypes.func.isRequired,
};
