import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/movies';
import './FindMovie.scss';

export const FindMovie = ({ movies, setMovies }) => {
  const [movie, createMovie] = useState(null);
  const [isChanging, setIsChanging] = useState(false);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');

  const setMovie = () => {
    findMovie(query)
      .then((result) => {
        if (result.Response === 'False') {
          setError(true);
          setIsChanging(false);
          createMovie(null);

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

  const findMovie = (inputText) => {
    const result = getMovie(encodeURI(inputText.toLowerCase()))
      .then(obj => ({ ...obj }));

    return result;
  };

  const addMovie = (newMovie) => {
    if (movies.find(item => item.imdbId === newMovie.imdbId)) {
      return false;
    }

    setMovies([...movies, newMovie]);

    return true;
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
              onChange={({ target }) => {
                setError(false);
                setQuery(target.value.trimLeft());
              }}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  setMovie();
                }
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
                if (!movie) {
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
  movies: PropTypes.string.isRequired,
  setMovies: PropTypes.func.isRequired,
};
