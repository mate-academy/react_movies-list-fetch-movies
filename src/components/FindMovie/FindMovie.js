import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';
import { getFilm } from '../../api/api';

export const FindMovie = ({ movies, addMovie }) => {
  const [query, setQuery] = useState('');
  const [newFilm, setNewFilm] = useState({});
  const [error, setError] = useState(false);
  const [shouldRenderPreview, setShouldRenderPreview] = useState(false);
  const [addingError, setAddingError] = useState(false);

  const handleChange = (event) => {
    setQuery(event.target.value);
    setError(false);
    setNewFilm({});
    setShouldRenderPreview(false);
  };

  const searchFilm = async() => {
    const request = await getFilm(query);

    if (request.Response === 'True') {
      setNewFilm({
        title: request.Title,
        description: request.Plot,
        imgUrl: request.Poster,
        imdbUrl: `https://www.imdb.com/title/${request.imdbID}/`,
        imdbId: request.imdbID,
      });
      setError(false);
      setShouldRenderPreview(true);
      setAddingError(false);
    } else {
      setError(true);
      setShouldRenderPreview(false);
      setNewFilm({});
    }
  };

  const handleFind = () => {
    searchFilm(query);
  };

  const handleAdd = () => {
    if (movies.some(movie => movie.imdbId === newFilm.imdbId)) {
      setAddingError(true);
    } else if (query && Object.keys(newFilm).length !== 0) {
      addMovie(newFilm);
      setShouldRenderPreview(false);
      setAddingError(false);
      setQuery('');
      setNewFilm({});
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          handleAdd();
        }}
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
              className={`input ${error ? 'is-danger' : ''}`}
              autoComplete="off"
              value={query}
              onChange={handleChange}
              onKeyUp={(event) => {
                if (event.key === 'Enter') {
                  handleFind();
                }
              }}
            />
          </div>

          {error
          && (
            <>
              <p className="help is-danger">
                Can&apos;t find a movie with such a title
              </p>
            </>
          )
          }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={handleFind}
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

      {addingError
          && (
            <>
              <p className="help is-danger">
                This movie already added
              </p>
            </>
          )
      }

      {shouldRenderPreview && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...newFilm} />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      imgUrl: PropTypes.string.isRequired,
      imdbUrl: PropTypes.string.isRequired,
      imdbId: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  addMovie: PropTypes.func.isRequired,
};
