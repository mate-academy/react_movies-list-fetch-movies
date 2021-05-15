import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { PropTypes } from 'prop-types';
import { MovieCard } from '../MovieCard';
import { request } from '../../api';

export const FindMovie = ({ addMovie }) => {
  const [query, setValue] = useState('');
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');
  const findMovie = title => (
    request(title).then((res) => {
      if (res.Response === 'True') {
        setError('');
        setMovie({
          title: res.Title,
          description: res.Plot,
          imgUrl: res.Poster,
          imdbUrl: `https://www.imdb.com/title/${res.imdbID}`,
          imdbId: res.imdbID,
        });
      } else {
        setError('Can\'t find a movie with such a title!');
      }
    }));

  const valid = () => {
    try {
      addMovie(movie);
      setMovie('');
      setValue('');
    } catch {
      setError(`"${movie.title}" has already been added!`);
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
              className={classNames('input', { 'input is-danger': error })}
              value={query}
              onChange={(e) => {
                setValue(e.target.value);
                setError('');
                setMovie('');
              }}
            />
          </div>
          {error && (<p className="help is-danger">{error}</p>)}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className={classNames('button', { 'button is-light': error })}
              onClick={(e) => {
                e.preventDefault();
                findMovie(query);
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={valid}
              disabled={!movie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {movie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard {...movie} />
          </>
        )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
