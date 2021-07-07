import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
// import { MoviesList } from '../MoviesList';
// import movies from '../../api/movies.json';

const classNames = require('classnames');

const getDataFromServer = query => (
  fetch(`http://www.omdbapi.com/?apikey=86a74c7&t=${query}`)
    .then(response => response.json())
);

export const FindMovie = ({ addMovie }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [findedMovie, setFindedMovie] = useState();
  const [isMovieFinded, setIsMovieFinded] = useState(false);
  const [isError, setIsError] = useState(false);

  const searchHandler = async() => {
    const movieFromServer = await getDataFromServer(searchQuery);

    if (movieFromServer.Response === 'False') {
      setIsMovieFinded(false);
      setFindedMovie(null);
      setIsError(true);

      return;
    }

    setFindedMovie({
      title: movieFromServer.Title,
      description: movieFromServer.Plot,
      imgUrl: movieFromServer.Poster,
      imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}`,
      imdbId: movieFromServer.imdbID,
    });
    setIsMovieFinded(true);
  };

  const addToListHandler = () => {
    if (isMovieFinded) {
      addMovie(findedMovie);
    } else {
      window.alert('find movie firstly');
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          searchHandler();
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
              value={searchQuery}
              placeholder="Enter a title to search"
              className={classNames({
                input: true,
                'is-danger': isError,
              })}
              onChange={(event) => {
                setIsError(false);
                setSearchQuery(event.target.value);
              }}
            />
          </div>

          {isError ? (
            <p className="help is-danger is hidden">
              Can&apos;t find a movie with such a title
            </p>
          ) : ''}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={searchHandler}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addToListHandler}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {!isMovieFinded ? '' : (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard {...findedMovie} />
          </>
        )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
