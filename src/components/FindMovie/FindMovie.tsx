import React, { FormEvent, useState } from 'react';
import classNames from 'classnames';

import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { getMovie } from '../../api';

import './FindMovie.scss';

type Props = {
  addMovie: (movie: Movie) => void;
};

const DEFAULT_IMAGE_URL =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>();
  const [movieTitle, setMovieTitle] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    getMovie(movieTitle)
      .then((data: MovieData | ResponseError) => {
        if ('Error' in data) {
          setErrorMessage("Can't find a movie with such a title");
        } else {
          const movieData = data as MovieData;
          const newMovie: Movie = {
            title: movieData.Title,
            description: movieData.Plot,
            imgUrl: movieData.Poster,
            imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
            imdbId: movieData.imdbID,
          };

          if (newMovie.imgUrl === 'N/A') {
            newMovie.imgUrl = DEFAULT_IMAGE_URL;
          }

          setMovie(newMovie);
          setErrorMessage('');
        }
      })
      .finally(() => setIsLoading(false));
  };

  const reset = () => {
    setMovie(null);
    setMovieTitle('');
    setErrorMessage('');
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMovieTitle(event.currentTarget.value);
    setErrorMessage('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleFormSubmit} onReset={reset}>
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
              className="input"
              value={movieTitle}
              onChange={handleTitleChange}
            />
          </div>

          {errorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMessage}
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
              disabled={!movieTitle}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && !errorMessage && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  addMovie(movie as Movie);
                  reset();
                }}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {movie && !errorMessage && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
