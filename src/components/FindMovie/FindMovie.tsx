import React, { useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';

type Props = {
  onAddMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const defaultPicture
    = 'https://via.placeholder.com/360x270.png?text=no%20preview';

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setHasError(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setHasError(false);

    getMovie(query)
      .then((data: MovieData | ResponseError) => {
        if ('Error' in data) {
          setHasError(true);
          setMovie(null);
        } else {
          const viewPoster
            = data.Poster === 'N/A' ? defaultPicture : data.Poster;

          setMovie({
            title: data.Title,
            description: data.Plot,
            imgUrl: viewPoster,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
            imdbId: data.imdbID,
          });
        }
      })

      .finally(() => {
        setLoading(false);
      });
  };

  const handleAddMovie = () => {
    if (movie) {
      onAddMovie(movie);
      setMovie(null);
      setQuery('');
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              value={query}
              onChange={handleQueryChange}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames(
                'input',
                { 'is-danger': hasError },
              )}
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
                'button',
                'is-light',
                { 'is-loading': loading },
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
                onClick={handleAddMovie}
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
