import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieData } from '../../types/MovieData';
import { getMovie } from '../../api';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

const DEFAULT_PICTURE =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [isError, setIsError] = useState(false);
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const movieIsFound = !isError && movie;

  const handleFindAMovie = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setIsLoading(true);

    getMovie(query)
      .then(response => {
        const error: ResponseError = response as ResponseError;

        if (error.Response === 'False') {
          setIsError(true);
          setMovie(null);
        } else {
          const movieData = response as MovieData;
          const picture =
            movieData.Poster === 'N/A' ? DEFAULT_PICTURE : movieData.Poster;

          setMovie({
            description: movieData.Plot,
            imdbId: movieData.imdbID,
            imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
            imgUrl: picture,
            title: movieData.Title,
          });
          setIsError(false);
        }
      })
      .catch(() => {
        setIsError(true);
        setMovie(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsError(false);
  };

  const handleAddToTheList = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (movie) {
      setQuery('');
      setMovie(null);
      onAddMovie(movie);
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
              value={query}
              onChange={handleChangeQuery}
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': isError })}
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
              onClick={handleFindAMovie}
              disabled={!query}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>
          {movieIsFound && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddToTheList}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movieIsFound && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie as Movie} />
        </div>
      )}
    </>
  );
};
