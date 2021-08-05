import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

const BASE_URL = 'https://www.omdbapi.com/?apikey=53a187d&t=';

export const FindMovie = ({ setFilm }) => {
  const [inputText, setInputText] = useState('');
  const [title, onTitleChange] = useState('');
  const [film, setCurentFilm] = useState(null);
  const [filmFound, setFilmFound] = useState(true);
  const [showFilm, setFilmShoving] = useState(false);

  const getFilm = async() => {
    const searchResult = await fetch(BASE_URL + title)
      .then(response => response.json())
      .then(result => result);

    setFilmShoving(true);
    if (searchResult.Response === 'False') {
      setFilmShoving(false);
      setFilmFound(false);
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
              className={`input ${filmFound
                ? ''
                : 'is-danger'
              }`
              }
              value={inputText}
              onChange={(event) => {
                onTitleChange(event.target.value);
                setInputText(event.target.value);
                setFilmFound(true);
              }}
            />
          </div>
          {
            filmFound
              ? ''
              : (
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
                setFilmShoving(false);
                setInputText('');
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
            showFilm
              ? <MovieCard {...film} />
              : ''
          )
        }
      </div>
    </>
  );
};

FindMovie.propTypes = {
  setFilm: PropTypes.func.isRequired,
};
