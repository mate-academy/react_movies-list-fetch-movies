import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [givenMovie, setGivenMovie] = useState({} as Movie);
  const [movieNotFound, setMovieNotFound] = useState(false);
  const [queryEnd, setQueryEnd] = useState(false);
  const [queryInProgress, setQueryInProgress] = useState(false);

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    setQueryInProgress(true);

    getMovie(searchQuery).then((value) => {
      if ('Title' in value) {
        setGivenMovie({
          title: value.Title,
          description: value.Plot,
          imgUrl: value.Poster !== 'N/A'
            ? value.Poster
            : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${value.imdbID}`,
          imdbId: value.imdbID,
        });
      } else {
        setMovieNotFound(true);
      }
    }).finally(() => {
      setQueryInProgress(false);

      setQueryEnd(true);
    });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => submitHandler(event)}
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
              className="input is-dander"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setMovieNotFound(false);
              }}
            />
          </div>

          {movieNotFound && (
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
              className={classNames('button is-light',
                {
                  'is-loading': queryInProgress,
                })}
              disabled={!searchQuery.length}
            >
              {queryEnd ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            {Object.keys(givenMovie).length > 0 && searchQuery && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  addMovie(givenMovie);
                  setSearchQuery('');
                  setGivenMovie({} as Movie);
                }}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {Object.keys(givenMovie).length > 0
        && (
          <div className="container" data-cy="previewContainer">
            <h2 className="title">Preview</h2>
            <MovieCard movie={givenMovie} />
          </div>
        )}
    </>
  );
};
