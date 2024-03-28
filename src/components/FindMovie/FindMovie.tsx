import React, { FormEvent, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

type Props = {
  onMoviesChange: (movie: Movie) => void;
};

const DEFAULT_IMAGE_URL =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<Props> = ({ onMoviesChange = () => {} }) => {
  const [movie, setMovie] = useState<Movie | null>();
  const [query, setQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    getMovie(query)
      .then((value: MovieData | ResponseError) => {
        if ('Error' in value) {
          setErrorMessage("Can't find a movie with such a title");
        } else {
          const movieData = value as MovieData;
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
      .finally(() => setLoading(false));
  };

  const reset = () => {
    setQuery('');
    setMovie(null);
    setErrorMessage('');
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
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
              value={query}
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
                'is-loading': loading,
              })}
              disabled={!query}
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
                  onMoviesChange(movie as Movie);
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
