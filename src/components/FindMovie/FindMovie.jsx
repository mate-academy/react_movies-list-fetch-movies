import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import { Popup } from '../Popup';
import { getMoviesFromServer } from '../../helpers';
import './FindMovie.scss';

export const FindMovie = React.memo(({ moviesIds, addNewMovies }) => {
  const [title, setTitle] = useState('');
  const [moviesFromServer, setMoviesList] = useState([]);
  const [error, setError] = useState('');

  const handleUserChoise = (list) => {
    addNewMovies(list);
    setMoviesList([]);
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
            setError('');
          }}
        />
        <button
          type="button"
          className="button"
          disabled={title.length < 3}
          onClick={async() => {
            const movies = await getMoviesFromServer(title, setTitle);

            if (movies.message) {
              setError(movies.message);

              return;
            }

            setMoviesList(movies);
            setTitle('');
          }}
        >
          Find Movie
        </button>
      </div>

      <div
        role="link"
        styling="link"
        tabIndex={0}
        className={`popup ${!moviesFromServer.length && 'is-hidden'}`}
        onClick={(event) => {
          if (event.currentTarget === event.target) {
            setMoviesList([]);
          }
        }}
        aria-hidden
      >
        {
          !!moviesFromServer.length
          && (
            <Popup
              error={error}
              moviesIds={moviesIds}
              moviesFromServer={moviesFromServer}
              callBack={handleUserChoise}
              closePopup={setMoviesList}
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
