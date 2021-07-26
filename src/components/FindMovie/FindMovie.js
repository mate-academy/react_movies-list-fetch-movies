import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

const BASE_URL = 'https://www.omdbapi.com/?apikey=97f17f88&t=';

export const FindMovie = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [wasFilmFound, setSearchResult] = useState(true);
  const [film, setFoundFilm] = useState(null);

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
              value={title}
              placeholder="Enter a title to search"
              className={classnames(
                'input',
                {
                  'is-danger': !wasFilmFound,
                },
              )}
              onChange={({ target }) => {
                setTitle(target.value);
                setSearchResult(true);
              }}
            />
          </div>

          {!wasFilmFound
          && (
          <p className="help is-danger">
            Can&apos;t find a movie with such a title
          </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => {
                if (title === '') {
                  setSearchResult(false);
                  setFoundFilm(null);

                  return;
                }

                fetch(BASE_URL + title)
                  .then(response => response.json())
                  .then((movie) => {
                    if (movie.Response === 'False') {
                      setFoundFilm(null);
                      setSearchResult(false);

                      return;
                    }

                    const foundFilm = {
                      title: movie.Title,
                      description: movie.Plot,
                      imgUrl: movie.Poster,
                      imdbId: movie.imdbID,
                      imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
                    };

                    setFoundFilm(foundFilm);
                    setSearchResult(true);
                  });
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                if (!film) {
                  return;
                }

                onSubmit(film);

                setTitle('');
                setFoundFilm(null);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {film && <MovieCard {...film} />}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
