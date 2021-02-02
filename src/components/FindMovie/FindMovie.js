import React, { useState, useEffect } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';
import { usePrevious } from 'react-hanger';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/getMovie';

export const FindMovie = (props) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState({});
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [moviePreview, setMoviePreview] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const prevQuery = usePrevious(query);

  useEffect(() => {
    if (!query) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }

    if (query !== prevQuery) {
      setIsValidUrl(false);
    }
  }, [query]);

  const onHandleInput = (e) => {
    setQuery(e.target.value);
  };

  const find = async() => {
    const newMovie = await getMovie(query);

    if (newMovie.Response === 'False') {
      setIsValidUrl(true);
      setMoviePreview(false);

      return;
    }

    setMovie({
      title: newMovie.Title,
      description: newMovie.Plot,
      imgUrl: newMovie.Poster,
      imdbUrl: `https://www.imdb.com/title${newMovie.imdbID}`,
      imdbId: newMovie.imdbID,
    });
    setMoviePreview(true);
    setIsValidUrl(false);
  };

  const onAddButton = () => {
    if (!query) {
      setIsValidUrl(true);

      return;
    }

    props.addMovie(movie);
    setQuery('');
    setMoviePreview(false);
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
              value={query}
              onChange={onHandleInput}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${isValidUrl ? 'is-danger' : ''}`}
            />
          </div>

          {isValidUrl ? (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          ) : ''}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              onClick={find}
              type="button"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              disabled={buttonDisabled}
              type="button"
              className="button is-primary"
              onClick={onAddButton}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {moviePreview && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...movie} />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
