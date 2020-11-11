import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';

function searchRequest(baseURL, setMovieFromServer, setError) {
  fetch(baseURL)
    .then(async(response) => {
      const data = await response.json();

      if (response.ok) {
        return data;
      }

      throw new Error(data.message);
    })
    .then((data) => {
      setMovieFromServer({
        title: data.Title,
        description: data.Plot,
        imgUrl: data.Poster,
        imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
        imdbId: data.imdbID,
      });
    })
    .catch((fetchError) => {
      setError(fetchError.message);
    });
}

function submitMovieForm(
  event, sendMovie, newMovie, setInputValue,
  setIsFocused, setMovieFromServer, movieFromServer, moviesToRender,
) {
  if (movieFromServer) {
    if (!moviesToRender
      .some(movie => movie.imdbId === movieFromServer.imdbId)
    ) {
      moviesToRender.push(movieFromServer);
    }
  }

  event.preventDefault();
  sendMovie(newMovie);
  setInputValue('');
  setIsFocused(false);
  setMovieFromServer(null);
}

export function FindMovie(props) {
  const [movieFromServer, setMovieFromServer] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState('try again later');
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const baseURL = `https://www.omdbapi.com/?apikey=52026275&t=${inputValue}`;
  const moviesToRender = [...props.movies];

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => submitMovieForm(
          event, props.addNewMovie,
          moviesToRender, setInputValue,
          setIsFocused, setMovieFromServer,
          movieFromServer, moviesToRender,
        )}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={isFocused && !inputValue
                  ? 'input is-danger'
                  : 'input'
                }
                value={inputValue}
                onChange={event => setInputValue(event.target.value)}
                onBlur={() => setIsFocused(true)}
              />
            </div>
          </label>

          <p className="help is-danger">
            {
              isFocused && !inputValue
                ? 'Can\'t find a movie with such a title'
                : ''
            }
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => searchRequest(
                baseURL, setMovieFromServer, setError,
                moviesToRender, movieFromServer,
              )}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movieFromServer && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...movieFromServer} />
        </div>
      )}
    </>
  );
}

FindMovie.propTypes = {
  addNewMovie: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imgUrl: PropTypes.string.isRequired,
    imdbUrl: PropTypes.string.isRequired,
    imdbId: PropTypes.string.isRequired,
  })).isRequired,
};
