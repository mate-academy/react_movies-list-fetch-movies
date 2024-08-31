import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { ResponseError } from '../../types/ReponseError';
import { MovieData } from '../../types/MovieData';
import cn from 'classnames';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  sendMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ sendMovie }) => {
  const [state, setState] = useState({
    inputValue: '',
    sendQuery: '',
    loader: false,
    foundMovie: null as MovieData | ResponseError | null,
    inputError: false,
  });

  useEffect(() => {
    if (state.sendQuery) {
      setState(prev => ({ ...prev, loader: true }));
      getMovie(state.sendQuery)
        .then(result => {
          if ('Error' in result) {
            setState(prev => ({
              ...prev,
              inputError: true,
              foundMovie: null,
            }));
          } else {
            setState(prev => ({
              ...prev,
              foundMovie: result,
              inputError: false,
            }));
          }
        })
        .finally(() => setState(prev => ({ ...prev, loader: false })));
    }
  }, [state.sendQuery]);

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setState(prev => ({ ...prev, sendQuery: state.inputValue }));
  };

  const handleInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({
      ...prev,
      inputValue: ev.target.value,
      inputError: false,
    }));
  };

  const convertToMovie = (data: MovieData): Movie => ({
    title: data.Title,
    description: data.Plot,
    imgUrl: data.Poster,
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    imdbId: data.imdbID,
  });

  const handleAddButton = () => {
    if (state.foundMovie && !('Error' in state.foundMovie)) {
      const movie = convertToMovie(state.foundMovie as MovieData);

      sendMovie(movie);

      setState(prev => ({
        ...prev,
        inputValue: '',
        sendQuery: '',
        foundMovie: null,
      }));
    }
  };

  return (
    <form className="find-movie" onSubmit={handleSubmit}>
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
            className={cn('input', { 'is-danger': state.inputError })}
            value={state.inputValue}
            onChange={ev => handleInput(ev)}
          />

          {state.inputError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            data-cy="searchButton"
            type="submit"
            className={cn('button is-light', { 'is-loading': state.loader })}
            disabled={!state.inputValue}
          >
            Find a movie
          </button>
        </div>

        {state.foundMovie && !('Error' in state.foundMovie) && (
          <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
              onClick={handleAddButton}
            >
              Add to the list
            </button>
          </div>
        )}
      </div>

      {state.foundMovie && !('Error' in state.foundMovie) && (
        <>
          <div className="container" data-cy="previewContainer">
            <h2 className="title">Preview</h2>
            <MovieCard movie={convertToMovie(state.foundMovie as MovieData)} />
          </div>
        </>
      )}
    </form>
  );
};
