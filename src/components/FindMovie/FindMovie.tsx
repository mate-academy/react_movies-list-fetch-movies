import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';
import { MOVIE_URLS } from '../../constants/url';

type Props = {
  onMovieAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onMovieAdd }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(false);
    }

    setQuery(event.target.value);
  };

  const handleAddToTheMoviesList = () => {
    if (movie) {
      onMovieAdd(movie);
      setMovie(null);
      setQuery('');
    }
  };

  const handleFormOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const response = await getMovie(query);

    if ('Error' in response) {
      setError(true);
      setLoading(false);

      return;
    }

    setMovie({
      title: response.Title,
      description: response.Plot,
      imgUrl:
        response.Poster === 'N/A'
          ? MOVIE_URLS.PLACEHOLDER_POSTER
          : response.Poster,
      imdbUrl: MOVIE_URLS.IMDB + response.imdbID,
      imdbId: response.imdbID,
    });

    setLoading(false);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleFormOnSubmit}>
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
                'is-danger': error,
              })}
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={!query.trim()}
              data-cy="searchButton"
              type="submit"
              className={classNames('button', {
                'is-loading': loading,
              })}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddToTheMoviesList}
              >
                Add to the list
              </button>
            )}
          </div>
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
