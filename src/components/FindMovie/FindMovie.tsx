import React, { useState } from 'react';
import classnames from 'classnames';

import './FindMovie.scss';
import { ResponseError } from '../../types/ReponseError';
import { MovieData } from '../../types/MovieData';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

const DEFAULT_IMG_URL
  = 'https://via.placeholder.com/360x270.png?text=no%20preview';

type Props = {
  onAddMovie: (value: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isMovieExist, setIsMovieExist] = useState(false);

  const checkIfMovieExist = (response: ResponseError | MovieData):
  response is MovieData => !('Error' in response);

  const handleSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setLoading(true);

    getMovie(query)
      .then((foundMovie) => {
        if (checkIfMovieExist(foundMovie)) {
          const {
            Title, imdbID, Plot, Poster,
          } = foundMovie;

          const newMovie: Movie = {
            title: Title,
            description: Plot,
            imgUrl: Poster === 'N/A'
              ? DEFAULT_IMG_URL
              : Poster,
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            imdbId: imdbID,
          };

          setMovie(newMovie);
        } else {
          setIsMovieExist(true);
        }
      }).finally(() => setLoading(false));
  };

  const reset = () => {
    setQuery('');
    setMovie(null);
    setIsMovieExist(false);
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
              className={classnames(
                'input',
                {
                  'is-danger': isMovieExist,
                },
              )}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsMovieExist(false);
              }}
            />
          </div>

          {isMovieExist && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={!query}
              data-cy="searchButton"
              type="submit"
              className={classnames(
                'button',
                'is-light',
                {
                  'is-loading': loading,
                },
              )}
              onClick={(event) => {
                handleSubmit(event);
              }}
            >
              {movie
                ? ('Search again')
                : ('Find a movie')}
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
                    onAddMovie(movie);
                    reset();
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
