import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';

type Props = {
  setMovies: (value: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ setMovies }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFound, setIsFound] = useState<ResponseError | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleOnSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (query) {
      const preparedQuery = query.trim().toLowerCase();

      getMovie(preparedQuery).then(response => {
        if (Object.hasOwn(response, 'Title')) {
          const {
            Poster,
            Title,
            Plot,
            imdbID,
          } = response as MovieData;

          const imgUrl = Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : Poster;

          const newMovie = {
            title: Title,
            description: Plot,
            imgUrl,
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            imdbId: imdbID,
          };

          setMovie(newMovie);
          setIsFound(null);
        }

        if (Object.hasOwn(response, 'Error')) {
          setIsFound(response as ResponseError);
        }
      }).finally(() => setIsLoading(false));
    }
  };

  const handleAddButton = (element: Movie) => {
    setMovies(element);
    setMovie(null);
    setQuery('');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsFound(null);
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
              className={classNames('input', { 'is-danger': isFound?.Error })}
              value={query}
              onChange={(event) => handleInputChange(event)}
            />
          </div>

          {isFound?.Error && (
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
              disabled={query.length === 0}
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              onClick={(event) => handleOnSubmit(event)}
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
                onClick={() => handleAddButton(movie)}
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
