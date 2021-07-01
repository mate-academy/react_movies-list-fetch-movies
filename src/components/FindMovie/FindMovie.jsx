import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import { Popup } from '../Popup';
import './FindMovie.scss';

const BASE_URL = 'https://www.omdbapi.com/?apikey=b8cd40cf&s=';

const getMoviesFromServer = async(title, setTitle, handleAdd, handleError) => {
  const response = await fetch(`${BASE_URL}${title}`);

  if (!response.ok) {
    return false;
  }

  const resultObject = await response.json();

  if (resultObject.Error) {
    handleError(resultObject.Error);

    return false;
  }

  const moviesFromServer = await resultObject.Search;
  const moviesList = await Promise.all(moviesFromServer.map(movie => (
    fetch(`https://www.omdbapi.com/?apikey=b8cd40cf&i=${movie.imdbID}`)
      .then(r => r.json()))));

  handleAdd(moviesList.map(movie => ({
    title: movie.Title,
    description: movie.Plot,
    movie: movie.imdbID,
    imgUrl: movie.Poster,
    imdbId: movie.imdbID,
  })));

  setTitle('');

  return true;
};

export const FindMovie = React.memo(({ moviesIds, addNewMovies }) => {
  const [title, setTitle] = useState('');
  const [moviesFromServer, handleChange] = useState([]);
  const [error, handleError] = useState('');

  const handleUserChoise = (list) => {
    addNewMovies(list);
    handleChange([]);
  };

  return (
    <>
      <div className="find-movie">
        <TextField
          error={!!error}
          style={{
            width: 300,
          }}
          variant="outlined"
          label={!error ? 'Movie Title' : error}
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            handleError('');
          }}
        />
        <button
          type="button"
          className="button"
          disabled={title.length < 3}
          onClick={() => {
            getMoviesFromServer(title, setTitle, handleChange, handleError);
          }}
        >
          Find Movie
        </button>
      </div>

      <div
        role="link"
        styling="link"
        tabIndex={0}
        className="popup"
        style={{ visibility: moviesFromServer.length ? 'visible' : 'hidden' }}
        onClick={(event) => {
          if (event.currentTarget === event.target) {
            handleChange([]);
          }
        }}
        onKeyDown={() => { }}
      >
        {
          !!moviesFromServer.length
          && (
            <Popup
              error={error}
              moviesIds={moviesIds}
              moviesFromServer={moviesFromServer}
              callBack={handleUserChoise}
              closePopup={handleChange}
            />
          )
        }
      </div>
    </>
  );
});

FindMovie.propTypes = {
  moviesIds: PropTypes.arrayOf(
    PropTypes.string.isRequired,
  ).isRequired,
  addNewMovies: PropTypes.func.isRequired,
};
