import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';

import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

import { getMovie } from '../../api';

type Props = {
  onAddToTheList: (movie: Movie) => void;
};

const isResponseError
  = (response: MovieData | ResponseError): response is ResponseError => {
    return (response as ResponseError).Response === 'False';
  };

const getPosterUrl = (poster: string) => {
  if (poster === 'N/A') {
    return 'https://via.placeholder.com/360x270.png?text=no%20preview';
  }

  return poster;
};

export const FindMovie: React.FC<Props> = ({ onAddToTheList }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasError(false);

    setSearchQuery(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedQuery = searchQuery.trim().toLowerCase();

    try {
      setIsLoading(true);

      const movieData = await getMovie(normalizedQuery);

      if (isResponseError(movieData)) {
        setHasError(true);
      } else {
        const {
          Title,
          Plot,
          Poster,
          imdbID,
        } = movieData;

        const foundMovie = {
          title: Title,
          description: Plot,
          imgUrl: getPosterUrl(Poster),
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        };

        setMovie(foundMovie);
      }
    } catch (error) {
      setHasError(true);

      throw new Error('Error occured while fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddtoTheList = (foundMovie: Movie) => {
    onAddToTheList(foundMovie);

    setSearchQuery('');
    setMovie(null);
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
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames(
                'input',
                { 'is-danger': hasError },
              )}
              value={searchQuery}
              onChange={handleOnChange}
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
                { 'is-loading': isLoading },
              )}
              disabled={!searchQuery}
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
                onClick={() => handleAddtoTheList(movie)}
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
