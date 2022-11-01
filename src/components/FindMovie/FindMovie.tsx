import React, { useState } from 'react';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';

const initialPosterValue
  = 'https://via.placeholder.com/360x270.png?text=no%20preview';

type Props = {
  addMovie: (movie: Movie) => void,
  isMovieInTheList: boolean,
};

export const FindMovie: React.FC<Props> = ({ addMovie, isMovieInTheList }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [isError, setIsError] = useState(false);
  const [isInputError, setIsInputError] = useState(false);
  const [isWaitToMovie, setWaitToMovie] = useState(false);

  const clearForm = () => {
    setQuery('');
    setMovie(null);
  };

  const findMovie = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setWaitToMovie(true);

    try {
      const response = await getMovie(query.toLowerCase());

      setWaitToMovie(false);

      if ('Error' in response) {
        setIsError(true);
        setIsInputError(true);

        return;
      }

      setMovie({
        title: response.Title,
        description: response.Plot,
        imgUrl: response.Poster === 'N/A'
          ? initialPosterValue
          : response.Poster,
        imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
        imdbId: response.imdbID,
      });
      setIsError(false);
    } catch {
      setIsError(true);
      setWaitToMovie(false);
      setIsInputError(true);
    }
  };

  const handlerInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsInputError(false);
  };

  const handlerAddMovieToTheList = () => {
    if (movie) {
      addMovie(movie);
    }

    clearForm();
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
              className="input is-dander"
              value={query}
              onChange={handlerInputChange}
            />
          </div>

          {isInputError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
          {isMovieInTheList && (
            <p className="help is-danger" data-cy="errorMessage">
              The movie is already in the list
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
                {
                  'is-loading': isWaitToMovie,
                },
              )}
              disabled={query.length === 0}
              onClick={(event) => findMovie(event)}
            >
              Find a movie
            </button>
          </div>

          {(movie && !isError) && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handlerAddMovieToTheList}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {(movie && !isError) && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
