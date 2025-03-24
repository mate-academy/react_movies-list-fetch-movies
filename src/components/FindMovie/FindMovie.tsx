import React, { useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';

import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (v: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovie = () => {
    getMovie(query)
      .then((movieData) => {
        if ('Error' in movieData) {
          setIsError(true);
          return;
        }

        setMovie({
          title: movieData.Title,
          description: movieData.Plot,
          imgUrl: movieData.Poster,
          imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
          imdbId: movieData.imdbID,
        })
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          setIsLoading(true);
          fetchMovie();
        }}>
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
              className={cn('input', { 'is-danger': isError })}
              value={query}
              onChange={event => {
                setQuery(event.target.value);
                setIsError(false);
              }}
            />
          </div>

          {isError && <p className="help is-danger" data-cy="errorMessage">
            Can&apos;t find a movie with such a title
          </p>}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn("button is-light", { 'is-loading': isLoading })}
              disabled={query === ''}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {movie && <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
              onClick={() => {
                onAdd(movie);
                setQuery('');
                setMovie(null);
              }}

            >
              Add to the list
            </button>
          </div>}
        </div>
      </form >

      {movie && <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        <MovieCard movie={movie} />
      </div>}
    </>
  );
};
