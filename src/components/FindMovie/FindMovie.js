import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';

const url = `https://www.omdbapi.com/?apikey=49e57e24&t=`;

export const FindMovie = (props) => {
  const [inputValue, setValue] = useState('');
  const [movie, setMovie] = useState('');
  const [faultFind, setfaultFind] = useState(false);

  const handleFind = (name) => {
    fetch(`${url}${name}`)
      .then(fetchMovie => fetchMovie.json())
      .then((fetchMovie) => {
        if (fetchMovie.Response === 'False') {
          setfaultFind(true);

          return;
        }

        setMovie(fetchMovie);
        setfaultFind(false);
      });
  };

  const handleAdd = (newMovie) => {
    if (faultFind) {
      return;
    }

    props.addMovie(newMovie);
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
              className="input is-danger"
              value={inputValue}
              onChange={event => setValue(event.target.value)}
            />
          </div>
          {faultFind && (
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
              onClick={() => handleFind(inputValue)}
            >
              Find a movie
            </button>
          </div>
          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => handleAdd({
                title: movie.Title,
                description: movie.Plot,
                imgUrl: movie.Poster,
                imdbUrl: `imdb.com/title/${movie.imdbID}`,
                imdbId: movie.imdbID,
              })}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      <div className="container">

        {movie && !faultFind ? (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard
              title={movie.Title}
              description={movie.Plot}
              imgUrl={movie.Poster}
              imdbUrl={`imdb.com/title/${movie.imdbID}`}
            />
          </>
        ) : `not found`}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
