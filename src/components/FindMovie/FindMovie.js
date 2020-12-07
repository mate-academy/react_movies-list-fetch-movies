import React, { useState } from 'react';
import './FindMovie.scss';

import { FindMovieTypes } from './FindMovieTypes';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ moviesList, onSetMoviesList }) => {
  const [error, setError] = useState(false);
  const [inputTitle, setInputTitle] = useState('');
  const [movie, setMovie] = useState(null);

  const request = title => fetch(
    ` http://www.omdbapi.com/?i=tt3896198&apikey=f6ee504e&t=${title}`,
  )
    .then(response => response.json())
    .catch(() => null);

  const handleFindMovie = () => {
    request(inputTitle)
      .then((result) => {
        setError(result === null || result.Response === 'False');
        setMovie(result.Response === 'False' ? null : result);
      });
  };

  const handleAddMovie = () => {
    if (!moviesList.find(film => film.imdbId === movie.imdbID)) {
      const updateMoviesList = [{
        title: movie.Title,
        description: movie.Plot,
        imgUrl: movie.Poster,
        imdbId: movie.imdbID,
        imdbUrl: `https://www.imdb.com/title/${movie.imdbID}/`,
      }, ...moviesList];

      onSetMoviesList(updateMoviesList);
    }

    setInputTitle('');
    setError(false);
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
              value={inputTitle}
              placeholder="Enter a title to search"
              className={error === true ? 'input is-danger' : 'input'}
              onFocus={() => setError(false)}
              onChange={event => setInputTitle(event.target.value)}
            />
          </div>

          {error && (
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
              onClick={handleFindMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleAddMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        { movie !== null && (
          <MovieCard
            title={movie.Title}
            description={movie.Plot}
            imgUrl={movie.Poster}
            imdbUrl={`https://www.imdb.com/title/${movie.imdbID}/`}
          />
        )}
      </div>
    </>
  );
};

FindMovie.propTypes = FindMovieTypes;
