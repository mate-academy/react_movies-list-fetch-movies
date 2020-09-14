import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({
  query,
  changeQuery,
  findMovie,
  addMovie,
  setQuery,
}) => {
  const [movie, createMovie] = useState({});
  const [isChanging, setIsChanging] = useState(false);
  const [error, setError] = useState(false);

  const setMovie = () => {
    findMovie()
      .then((result) => {
        if (result.Response === 'False') {
          setError(true);
          setIsChanging(false);
          createMovie({});

          return;
        }

        const { Title, Poster, Plot, imdbID } = result;

        setIsChanging(true);
        setError(false);
        setQuery('');
        createMovie({
          ...result,
          title: Title,
          imgUrl: Poster,
          description: Plot,
          imbdUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        });
      });
  };

  return (
    <>
      <form className="find-movie">
        <div className="field for-search">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', ({ 'is-danger': error }))}
              value={query}
              onChange={(event) => {
                setError(false);
                changeQuery(event.target.value.trimLeft());
              }}
            />
          </div>
          {error && ((error && isChanging && (
            <p className="help is-danger">
              This movie already exist
            </p>
          )) || (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          ))
          }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={setMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                if (Object.keys(movie).length === 0) {
                  return;
                }

                if (!addMovie(movie)) {
                  setError(true);

                  return;
                }

                setIsChanging(false);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {isChanging && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...movie} />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  query: PropTypes.string.isRequired,
  setQuery: PropTypes.func.isRequired,
  changeQuery: PropTypes.func.isRequired,
  findMovie: PropTypes.func.isRequired,
  addMovie: PropTypes.func.isRequired,
};
