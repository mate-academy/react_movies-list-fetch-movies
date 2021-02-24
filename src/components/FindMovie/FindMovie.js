import React, { useState } from 'react';
import './FindMovie.scss';

import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export const FindMovie = ({
  onAdd, sameMovie,
  noMovie, setNoMovie, setSameMovie,
}) => {
  const [title, setTitle] = useState('');
  const [newMovie, setNewMovie] = useState(null);
  const [emptyInput, setemptyInput] = useState(false);

  const handleChange = ({ target }) => {
    setTitle(target.value);
    setNoMovie(false);
    setSameMovie(false);
    setemptyInput(false);
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
      setNoMovie(true);
      setTitle('');
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    findNewMovie();
    setemptyInput(false);
  };

  const addMovie = () => {
    if (newMovie) {
      onAdd(newMovie);
      setTitle('');
      setemptyInput(false);
      setNewMovie(null);
      setNoMovie(false);
    } else {
      setemptyInput(true);
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
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              value={title}
              placeholder="Enter a title to search"
              className={noMovie
                ? 'input is-danger'
                : 'input'
              }
              onChange={handleChange}
            />
          </div>

          {noMovie
            && (
              <p className="help is-danger">
                Can&apos;t find a movie with such a title
              </p>
            )
          }
          {sameMovie
            && (
              <p className="help is-danger">
                This movie is already on the list
              </p>
            )
          }
          {emptyInput
            && (
              <p className="help is-danger">
                please enter the title first and find a movie
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
  setSameMovie: PropTypes.func.isRequired,
  setNoMovie: PropTypes.func.isRequired,
  sameMovie: PropTypes.bool.isRequired,
  noMovie: PropTypes.bool.isRequired,
};
