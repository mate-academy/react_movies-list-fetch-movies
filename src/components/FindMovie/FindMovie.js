import React, { useState } from 'react';
import './FindMovie.scss';

import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export const FindMovie = ({
  onAdd, error, setError,
}) => {
  const [title, setTitle] = useState('');
  const [newMovie, setNewMovie] = useState(null);
  const [isMovieFind, setIsMovieFind] = useState(true);

  const handleChange = ({ target }) => {
    setTitle(target.value);
    setError(false);
    setIsMovieFind(true);
  };

  async function findNewMovie() {
    const movieFromServer = await getMovie(title);

    setNewMovie({
      title,
      description: movieFromServer.Plot,
      imgUrl: movieFromServer.Poster,
      imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}/`,
      imdbId: movieFromServer.imdbID,
    });

    if (movieFromServer.Error) {
      setNewMovie(null);
      setTitle('');
      setIsMovieFind(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    findNewMovie();
  };

  const addMovie = () => {
    if (newMovie) {
      onAdd(newMovie);
      setTitle('');
      setNewMovie(null);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="find-movie"
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Find movie and add to the list
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              value={title}
              placeholder="Enter a title to search"
              className={error
                ? 'input is-danger'
                : 'input'
              }
              onChange={handleChange}
            />
          </div>

          {!isMovieFind
            && (
              <p className="help is-danger">
                Can&apos;t find a movie with such a title
              </p>
            )
          }
          {error
            && (
              <p className="help is-danger">
                This movie is already on the list
              </p>
            )
          }
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
              onClick={addMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {
        newMovie
        && (
          <div className="container">
            <h2 className="title">Preview</h2>
            <MovieCard {...newMovie} />
          </div>
        )
      }
    </>
  );
};

FindMovie.propTypes = {
  onAdd: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
};
