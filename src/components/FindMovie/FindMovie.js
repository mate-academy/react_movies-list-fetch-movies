import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

const BASE_URL = 'https://www.omdbapi.com/?apikey=53a187d&t=';

export const FindMovie = ({ setFilm }) => {
  const [inputText, setInputText] = useState('');
  const [title, onTitleChange] = useState('');
  const [film, setCurentFilm] = useState(null);
  const [filmFound, setSearchStatus] = useState(false);

  const getFilm = async() => {
    const searchResult = await fetch(BASE_URL + title)
      .then(response => response.json())
      .then(result => result);

    setSearchStatus(true);
    if (searchResult.Response === 'False') {
      setSearchStatus(false);
    }

    const preparedFilm = {
      title: searchResult.Title,
      description: searchResult.Plot,
      imgUrl: searchResult.Poster,
      imdbUrl: `https://www.imdb.com/title/${searchResult.imdbID}`,
      imdbID: searchResult.imdbID,
    };

    setCurentFilm(preparedFilm);
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
              value={inputText}
              onChange={(event) => {
                onTitleChange(event.target.value);
                setInputText(event.target.value);
              }}
            />
          </div>

          <p className="help is-danger">
            Can&apos;t find a movie with such a title
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={getFilm}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                setFilm(film);
                setSearchStatus(false);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {
          (
            filmFound
              ? <MovieCard {...film} />
              : 'not found movie'
          )
        }
      </div>
    </>
  );
};

FindMovie.propTypes = {
  setFilm: PropTypes.func.isRequired,
};
