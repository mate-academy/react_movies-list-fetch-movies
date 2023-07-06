/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Response } from '../../types/Response';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({ setMovies }) => {
  let response;
  let statusResponse = false;
  const [movie, setMovie] = useState<Movie>();
  const [inputAlert, setInputAlert] = useState(false);
  const [inputValue, setInpuValue] = useState('');
  const requestFilm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    getMovie(inputValue).then(res => {
      if (res instanceof MovieData) {
        response = res as Response;
        console.log('Then', statusResponse, response);
        statusResponse = true;
        setMovie({
          title: response.Title,
          description: response.Plot,
          imgUrl: response.Poster,
          imdbUrl: 'images/imdb-logo.jpeg',
          imdbId: response.imdbID,
        });
      }
    }).catch((error) => {
      console.log('Catch', statusResponse, error);
      setInputAlert(true);
      statusResponse = false;
    });
  };

  console.log(!![setInputAlert]);

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${inputAlert && 'is-danger'}`}
              value={inputValue}
              onChange={e => setInpuValue(e.target.value)}
            />
          </div>

          <p className="help is-danger" data-cy="errorMessage">
            {inputAlert && `Can ${inputValue} find a movie with such a title`}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className="button is-light"
              disabled={!inputValue}
              onClick={e => requestFilm(e)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
              disabled={!statusResponse}
              onClick={() => {
                if (statusResponse && movie) {
                  setMovies(prev => [...prev, movie]);
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {movie
        && (
          <MovieCard
            movie={movie}
          />
        )}
      </div>
    </>
  );
};
