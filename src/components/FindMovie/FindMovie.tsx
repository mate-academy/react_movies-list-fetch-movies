import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import cn from 'classnames';
import { MovieCard } from '../MovieCard';

type FindMovieProps = {
  handleMovieAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<FindMovieProps> = ({ handleMovieAdd }) => {
  const [query, setQuery] = useState('');
  const [findMovie, setFindMovie] = useState<Movie | null>();
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    setLoading(true);
    getMovie(query)
      .then(result => {
        if ('Error' in result) {
          setHasError(true);
          setFindMovie(null);

          return;
        }

        const normalizedMovie: Movie = {
          title: result.Title,
          description: result.Plot,
          imgUrl:
            result.Poster === 'N/A'
              ? 'https://via.placeholder.com/' + '360x270.png?text=no%20preview'
              : result.Poster,
          imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
          imdbId: result.imdbID,
        };

        setHasError(false);
        setFindMovie(normalizedMovie);
      })
      .finally(() => setLoading(false));
  };

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
              className={cn('input', {
                'is-danger': hasError,
              })}
              value={query}
              onChange={event => {
                setHasError(false);
                setQuery(event.target.value);
              }}
            />
          </div>
          {hasError && (
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
              className={cn('button', 'is-light', {
                'is-loading': loading,
              })}
              disabled={!query.trim()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {findMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  handleMovieAdd(findMovie);
                  setFindMovie(null);
                  setHasError(false);
                  setQuery('');
                }}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {findMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={findMovie} />
        </div>
      )}
    </>
  );
};
