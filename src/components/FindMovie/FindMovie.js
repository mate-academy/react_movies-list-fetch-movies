import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getFilm } from '../api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import movies from '../../api/movies.json';

export const FindMovie = ({ newMovies }) => {
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState(null);
  const [shouldShowError, setShouldShowError] = useState(true);

  const findExistMovie = () => {
    const titleToLow = title.toLowerCase();
    const moviesFromData = movies.find(movie => movie
      .title.toLowerCase() === titleToLow);

    if (moviesFromData) {
      setPreview(moviesFromData);
    }

    getFilm(title)
      .then((movie) => {
        if (movie.Response === 'False') {
          setShouldShowError(false);
          setPreview(null);
        } else {
          setPreview({
            title: movie.Title,
            description: movie.Plot,
            imdbId: movie.imdbID,
            imgUrl: movie.Poster,
            imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
          });
        }
      });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          setTitle('');
          setPreview(null);
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
              className={shouldShowError ? 'input' : 'input is-danger'}
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setShouldShowError(true);
              }}
            />
          </div>
          { shouldShowError || (
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
              onClick={() => findExistMovie()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              onClick={() => {
                if (preview) {
                  newMovies(preview);
                  setTitle('');
                  setPreview(null);
                }
              }
              }
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {preview && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...preview} />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  newMovies: PropTypes.func.isRequired,
};
