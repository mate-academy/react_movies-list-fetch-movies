import React, { FormEvent, useState } from 'react';
import classnames from 'classnames';
import './FindMovie.scss';

import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [loadError, setLoadError] = useState<ResponseError | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const loadMovie = async (
    currentQuery: string,
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setIsDataLoading(true);

    try {
      const data = await getMovie(currentQuery);

      if ('Error' in data) {
        setLoadError(data);
        setIsDataLoading(false);
      } else {
        setMovie({
          title: data.Title,
          description: data.Plot,
          imgUrl: data.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : data.Poster,
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          imdbId: data.imdbID,
        });
      }
    } catch {
      setLoadError({
        Response: 'False',
        Error: 'unexpected error',
      });
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleSubmitForm = (event: FormEvent<HTMLFormElement>) => {
    loadMovie(query.toLowerCase(), event);
  };

  const handleAddToList = (selectedMovie: Movie) => {
    addMovie(selectedMovie);
    setMovie(null);
    setQuery('');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setLoadError(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmitForm}
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
              onChange={handleInputChange}
            />
          </div>
          {loadError && (
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
              className={classnames(
                'button is-light',
                { 'is-loading': isDataLoading },
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
                onClick={() => handleAddToList(movie)}
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
