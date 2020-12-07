import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { PropTypes } from 'prop-types';
import { MovieCard } from '../MovieCard';
import { request } from '../../api';

export const FindMovie = ({ movies, setMovies }) => {
  const [value, setValue] = useState('');
  const [movie, setMovie] = useState('');
  const [error, setError] = useState(false);
  const handleFindMovie = title => (
    request(title).then((res) => {
      if (res.Response === 'True') {
        setError(false);
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
  const handleAddMovie = (moviesUsers, movieUsers) => {
    if (moviesUsers.find(movieItem => movieItem.imdbId === movieUsers.imdbId)) {
      setError(`"${movieUsers.title}" has already been added!`);
    } else {
      setMovies([...moviesUsers, movieUsers]);
      setMovie('');
      setValue('');
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
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError(false);
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
              onClick={() => handleFindMovie(value)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => handleAddMovie(movies, movie)}
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
  movies: PropTypes.arrayOf(PropTypes.object).isRequired,
  setMovies: PropTypes.func.isRequired,
};
