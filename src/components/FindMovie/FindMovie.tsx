import React, { ChangeEvent, FormEvent, useState } from 'react';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import './FindMovie.scss';

interface Props {
  onAddMovie: (newMovie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(query)
      .then(response => {
        if ('Error' in response) {
          setHasError(true);
          setMovie(null);

          return;
        }

        const {
          Title, Plot, Poster, imdbID,
        } = response;

        const defaultPoster = 'https://via.placeholder.com/'
          + '360x270.png?text=no%20preview';
        const imdbUrlLink = `https://www.imdb.com/title/${imdbID}`;

        setMovie({
          title: Title,
          description: Plot,
          imgUrl: Poster === 'N/A'
            ? defaultPoster
            : Poster,
          imdbUrl: imdbUrlLink,
          imdbId: imdbID,
        });
      })
      .catch(() => {
        setHasError(true);
        setMovie(null);
      })
      .finally(() => setIsLoading(false));
  };

  const handleMovieSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setHasError(false);
  };

  const handleMovieAdd = (newMovie: Movie) => {
    onAddMovie(newMovie);
    setMovie(null);
    setQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              onChange={handleMovieSearch}
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
              className={classNames(
                'button is-light',
                { 'is-loading': isLoading },
              )}
              disabled={!query}
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
                onClick={() => handleMovieAdd(movie)}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">
            Preview
          </h2>

          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
