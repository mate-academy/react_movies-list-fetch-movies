import React, { useState } from 'react';
import classNames from 'classnames';

import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [loader, setLoader] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setNoResult(false);
  };

  const searchHandle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoader(true);
    getMovie(query.trim())
      .then(data => {
        if (!data || ('Response' in data && data.Response === 'False')) {
          setNoResult(true);
          setFoundMovie(null);
        } else {
          const movieData = data as MovieData;

          const newMovie: Movie = {
            title: movieData.Title,
            description: movieData.Plot,
            imgUrl: movieData.Poster !== 'N/A'
              ? movieData.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
            imdbId: movieData.imdbID,
          };

          setFoundMovie(newMovie);
        }
      })
      .catch(() => setFoundMovie(null))
      .finally(() => setLoader(false));
  };

  const addHandler = () => {
    setQuery('');
    if (foundMovie) {
      onAdd(foundMovie);
    }

    setFoundMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={searchHandle}>
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
                'is-danger': noResult,
              })}
              value={query}
              onChange={handleQuery}
            />
          </div>

          {noResult && (
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
              className={classNames('button is-light', {
                'is-loading': loader,
              })}
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
                onClick={() => addHandler()}
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
          <MovieCard
            movie={foundMovie}
          />
        </div>
      )}
    </>
  );
};
