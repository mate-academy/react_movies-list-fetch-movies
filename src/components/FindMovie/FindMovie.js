import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

const BASE_URL = 'https://www.omdbapi.com/?apikey=97f17f88&t=';

export const FindMovie = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [searchResult, setSearchResult] = useState(true);
  const [foundFilm, setFoundFilm] = useState(null);

  const findFilm = () => {
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

        const film = {
          title: movie.Title,
          description: movie.Plot,
          imgUrl: movie.Poster,
          imdbId: movie.imdbID,
          imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
        };

        setFoundFilm(film);
        setSearchResult(true);
      });
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
              value={title}
              placeholder="Enter a title to search"
              className={classnames('input',
                { 'is-danger': !searchResult })}
              onChange={({ target }) => {
                setTitle(target.value);
                setSearchResult(true);
              }}
            />
          </div>

          {!searchResult
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
              onClick={findFilm}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                if (!foundFilm) {
                  return;
                }

                onSubmit(foundFilm);

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
        {foundFilm && <MovieCard {...foundFilm} />}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
