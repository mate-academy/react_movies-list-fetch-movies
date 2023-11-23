import React, { useEffect, useState } from 'react';
import cn from 'classnames';

import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { ResponseError } from '../../types/ReponseError';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';

type Props = {
  onMoviesAdd?: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({
  onMoviesAdd = () => { },
}) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [searchBtnTitle, setSearchBtnTitle] = useState('Find a movie');
  const [response, setResponse]
    = useState<MovieData | ResponseError | null>(null);
  const handleMovieTitleChange
    = (event: React.ChangeEvent<HTMLInputElement>) => {
      setMovieTitle(event.target.value);
      setIsError(false);
    };

  const handleAddBtnClick = () => {
    if (movie) {
      onMoviesAdd(movie);
      setMovie(null);
    }
  };

  useEffect(() => {
    if (!response) {
      return;
    }

    if ('Poster' in response
      && 'Title' in response
      && 'Plot' in response
      && 'imdbID' in response
    ) {
      setMovie({
        title: response.Title,
        description: response.Plot,
        imgUrl: response.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : response.Poster,
        imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
        imdbId: response.imdbID,
      });

      setMovieTitle('');
      setSearchBtnTitle('Search again');
    }

    if ('Error' in response) {
      setIsError(true);
      setSearchBtnTitle('Find a movie');
    }
  }, [response]);

  // eslint-disable-line

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(movieTitle)
      .then(setResponse)
      .finally(() => setIsLoading(false));
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
              className={cn('input', {
                'is-danger': isError,
              })}
              value={movieTitle}
              onChange={handleMovieTitleChange}
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
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!movieTitle}
            >
              {searchBtnTitle}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddBtnClick}
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
