import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';

type Props = {
  handleMovieAdd: (movieToFind: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ handleMovieAdd }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const defaultPicture =
    'https://via.placeholder.com/360x270.png?text=no%20preview';

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(false);
    setQuery(event.target.value);
  };

  const handleAddAndClear = () => {
    if (movie) {
      handleMovieAdd(movie);
    }

    setQuery('');
    setMovie(null);
    setIsError(false);
    setIsLoading(false);
  };

  const handleMovieSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (query.trim()) {
      getMovie(query)
        .then(responce => {
          if (responce.Response === 'True') {
            const imgUrl =
              responce.Poster === 'N/A' ? defaultPicture : responce.Poster;
            const imdbUrl = `https://www.imdb.com/title/${responce.imdbID}`;
            const movieData = {
              title: responce.Title,
              description: responce.Plot,
              imgUrl,
              imdbUrl,
              imdbId: responce.imdbID,
            };

            setMovie(movieData);
            setIsError(false);
          } else {
            setIsError(true);
          }
        })
        .catch(() => {
          setIsError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

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
              className={classNames('input', { 'is-danger': isError })}
              onChange={handleQueryChange}
              value={query}
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
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              onClick={handleMovieSearch}
              disabled={!query}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddAndClear}
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
