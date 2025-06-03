import React, { useEffect, useRef, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ResponseError';

const DEFAULTPICTURE =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

// -----------------------------------------

import * as moviesAPI from '../../api';

type FindMovieProps = {
  findMovie: (v: Movie) => void;
};

export const FindMovie: React.FC<FindMovieProps> = ({ findMovie }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [cardOfMovie, setCardOfMovie] = useState<Movie | null>(null);
  const [loader, setLoader] = useState(false);
  const [searchingError, setSearchingError] = useState('');
  const [buttonState, setButtonState] = useState(true);

  const timer = useRef(0);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVal: string = event.target.value;
    // console.log('varlue ' + newVal)

    setQuery(newVal);
    setButtonState(false);

    window.clearTimeout(timer.current);

    timer.current = window.setTimeout(() => {
      setAppliedQuery(newVal.charAt(0).toUpperCase() + newVal.slice(1));
      // console.log('finish');
    }, 1000);
  };

  const identifyResponse = (
    data: MovieData | ResponseError,
  ): data is ResponseError => {
    return (data as ResponseError).Response === 'False';
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let currentQuery: string;

    if (!appliedQuery) {
      currentQuery = query.trim();
    } else {
      currentQuery = appliedQuery;
    }

    setAppliedQuery(prev => (!prev ? query : prev));
    // console.log(query);

    setLoader(true);
    setSearchingError('');
    setCardOfMovie(null);
    await moviesAPI.wait(3000);
    // console.log(appliedQuery);

    let result: MovieData | ResponseError;

    try {
      result = (await moviesAPI.getMovie(currentQuery)) as
        | MovieData
        | ResponseError;

      if (identifyResponse(result)) {
        throw new Error(result.Error);
      }

      setCardOfMovie({
        title: result.Title,
        description: result.Plot,
        imgUrl: result.Poster ? result.Poster : DEFAULTPICTURE,
        imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
        imdbId: result.imdbID,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unexpected error';

      setSearchingError(message);
    } finally {
      setLoader(false);
    }
  };

  const handleAddMovie = (e: React.FormEvent) => {
    e.preventDefault();

    if (cardOfMovie !== null) {
      findMovie(cardOfMovie);
    }

    setButtonState(true);
    setSearchingError('');
    setCardOfMovie(null);
    setAppliedQuery('');
    setQuery('');
  };

  useEffect(() => {
    if (query === '') {
      setButtonState(true);
    }
  }, [query]);

  return (
    <>
      <form className="find-movie" onSubmit={onSubmit}>
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
              className={classNames('input', {
                'is-danger': searchingError.length > 0,
              })}
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          {searchingError.length > 0 && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={buttonState}
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': loader,
              })}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {cardOfMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {cardOfMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={cardOfMovie} />
        </div>
      )}
    </>
  );
};
