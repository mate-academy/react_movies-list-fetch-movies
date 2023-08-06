import React, { useState } from 'react';
import classNames from 'classnames';

import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie, MovieData } from '../../types';
import { MovieCard } from '../MovieCard';

type Props = {
  onMovieAdd: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ onMovieAdd }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [searchedMovie, setSearchedMovie] = useState<Movie | null>(null);

  const handleTitleChange = (newTitle: string): void => {
    setIsNotFound(false);
    setQuery(newTitle);
  };

  const handleAddToList = (movie: Movie): void => {
    onMovieAdd(movie);
    setQuery('');
    setSearchedMovie(null);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    setIsLoading(true);
    setIsNotFound(false);

    getMovie(query)
      .then(response => {
        if (Object.hasOwn(response, 'Title')) {
          const movieData = response as MovieData;

          const imgUrl = movieData.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : movieData.Poster;

          setSearchedMovie({
            imgUrl,
            title: movieData.Title,
            description: movieData.Plot,
            imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
            imdbId: movieData.imdbID,
          });
        }

        if (Object.hasOwn(response, 'Error')) {
          throw new Error();
        }
      })
      .catch(() => {
        setIsNotFound(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => handleFormSubmit(event)}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={query}
              onChange={event => handleTitleChange(event.target.value)}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': isNotFound,
              })}
            />
          </div>

          {isNotFound && (
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
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
            >
              Find a movie
            </button>
          </div>

          {searchedMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddToList(searchedMovie)}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {searchedMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={searchedMovie} />
        </div>
      )}
    </>
  );
};
