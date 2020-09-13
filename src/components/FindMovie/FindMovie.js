import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';
import { getFilm } from '../../api/api';

export const FindMovie = ({ movies, addMovie }) => {
  const [query, setQuery] = useState('');
  const [newFilm, setNewFilm] = useState({});
  const [error, setError] = useState(false);
  const [preview, setPreview] = useState(false);
  const [addingError, setAddingError] = useState(false);

  const handleChange = (event) => {
    setQuery(event.target.value);
    setError(false);
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
      setPreview(true);
      setAddingError(false);
    } else {
      setError(true);
      setPreview(false);
    }
  };

  const handleFind = () => {
    searchFilm(query);
  };

  const handleAdd = () => {
    if (movies.some(movie => movie.imdbId === newFilm.imdbId)) {
      setAddingError(true);
    } else {
      addMovie(newFilm);
      setPreview(false);
      setAddingError(false);
      setQuery('');
    }
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
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${error ? 'is-danger' : ''}`}
              value={query}
              onChange={handleChange}
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
              type="button"
              className="button is-primary"
              onClick={handleAdd}
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

      {preview && (
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
