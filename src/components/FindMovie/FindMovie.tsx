import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  onAdd: (movie: Movie) => void,
  moviesId: string[];
};

export const FindMovie: React.FC<Props> = (props) => {
  const { onAdd, moviesId } = props;
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const onLoadMovie = () => {
    setIsLoading(true);
    getMovie(query)
      .then(response => {
        if ('Error' in response) {
          setIsError(true);
        } else {
          setMovie({
            title: response.Title,
            description: response.Plot,
            imgUrl: response.Poster !== 'N/A'
              ? response.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
            imdbId: response.imdbID,
          });
        }
      })
      .finally(() => setIsLoading(false));
  };

  const onAddhandle = (newMovie: Movie) => {
    onAdd(newMovie);
    setMovie(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          onLoadMovie();
          setQuery('');
        }}
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
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          {isError && query.length === 0 && (
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
              className={classNames(
                'button is-light',
                { 'is-loading': isLoading === true },
              )}
              disabled={query.length === 0}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  if (!moviesId.includes(movie.imdbId)) {
                    onAddhandle(movie);
                  }

                  setMovie(null);
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
