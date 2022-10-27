/* eslint-disable */

import React, { useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';

import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: (newMovie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({addMovie}) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setQuery(event.target.value);
    setErrorMessage('');
  };

  const onAddMovie = (newMovie: Movie) => {
    addMovie(newMovie);
    setQuery('');
    setMovie(null);
  }

  const loadMovie = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const data = await getMovie(query);
    setIsLoading(false);

    if ('Error' in data) {
      setErrorMessage(data.Error);
    } else {
      const loadedMovie: Movie = {
        title: data.Title,
        description: data.Plot,
        imgUrl: data.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : data.Poster,
        imdbId: data.imdbID,
        imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
      }
      setMovie(loadedMovie);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => loadMovie(event)}
      >
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
              className="input"
              value={query}
              onChange={(event) => handleQuery(event)}
            />
          </div>
          {errorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              disabled={!query}
              className={cn(
                'button',
                'is-light',
                {
                  'is-loading': isLoading,
                },
              )}
            >
              {movie
                ? 'Search again'
                : 'Find a movie'}
            </button>
          </div>
          {movie && (
          <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
              onClick={() => onAddMovie(movie)}
            >
              Add to the list
            </button>
          </div>)}
        </div>
      </form>
      {movie && (
      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        <MovieCard movie={movie} />
      </div>)
      }

    </>
  );
};
