import React, { useState, useEffect, useCallback } from 'react';
import cn from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { ResponseError } from '../../types/ResponseError';
import { MovieData } from '../../types/MovieData';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';

const DEFAULT_POSTER
  = 'https://via.placeholder.com/360x270.png?text=no%20preview';

type Props = {
  addMovie: (film: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<MovieData | null | ResponseError>(null);
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);

  const handleQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(event.target.value);
    if (isError) {
      setIsError(false);
    }
  };

  const findMovie = useCallback(() => {
    setIsLoading(true);
    getMovie(query.trim())
      .then(movieData => {
        setData(movieData);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [query]);

  const handleFindButton = () => {
    findMovie();
  };

  const handleInputKeyPressEnter = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key !== 'Enter') {
      return;
    }

    e.preventDefault();
    findMovie();
  };

  const handleAddButton = () => {
    addMovie(foundMovie as Movie);
    setQuery('');
    setFoundMovie(null);
  };

  useEffect(() => {
    if (data !== null && 'Title' in data) {
      const newMovie: Movie = {
        title: data.Title,
        description: data.Plot,
        imgUrl: (!data.Poster || data.Poster === 'N/A')
          ? DEFAULT_POSTER
          : data.Poster,
        imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
        imdbId: data.imdbID,
      };

      setFoundMovie(newMovie);
    } else if (data !== null && data.Error) {
      setIsError(true);
    }
  }, [data]);

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
              className="input"
              value={query}
              onKeyPress={handleInputKeyPressEnter}
              onChange={handleQueryChange}
            />
          </div>

          {isError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={!query}
              data-cy="searchButton"
              type="button"
              className={cn('button is-light', { 'is-loading': isLoading })}
              onClick={handleFindButton}
            >
              Find a movie
            </button>
          </div>

          {foundMovie && (
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
      </form>

      {foundMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
