import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  onMovieAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onMovieAdd }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [searchedMovie, setSearchedMovie] = useState<Movie | null>(null);

  const handleTitleChange = (newTitle: string) => {
    setIsNotFound(false);
    setQuery(newTitle);
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

  const handleMovieAdd = (movie: Movie) => {
    onMovieAdd(movie);
    setQuery('');
    setSearchedMovie(null);
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
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', {
                'is-danger': isNotFound,
              })}
              value={query}
              onChange={event => handleTitleChange(event.target.value)}
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
              className={cn('button is-light', {
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
                onClick={() => handleMovieAdd(searchedMovie)}
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
