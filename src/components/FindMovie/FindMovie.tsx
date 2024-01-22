import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
// import { ResponseError } from '../../types/ReponseError';
// import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Prop = {
  addMovie: (a: Movie) => void;
};

export const FindMovie: React.FC<Prop> = ({ addMovie }) => {
  const [movieTitle, setMovieTitle] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(false);
    setMovieTitle(event.target.value);

    if (event.target.value.length) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  const handleSearchRequest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    getMovie(movieTitle)
      .then(data => {
        if ('Error' in data) {
          setIsError(true);
        }

        if ('Title' in data) {
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
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSearchRequest}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={movieTitle}
              onChange={handleSearchInput}
              data-cy="titleField"
              type="text"
              id="movie-title"
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
              disabled={isDisabled}
            >
              {movie ? 'Search again ' : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  if (movie) {
                    addMovie(movie);
                    setMovieTitle('');
                    setIsDisabled(true);
                    setMovie(null);
                  }
                }}
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
