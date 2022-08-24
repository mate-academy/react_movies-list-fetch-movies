import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard/MovieCard';
import './FindMovie.scss';

type Props = {
  onClickAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = (props) => {
  const { onClickAdd } = props;

  const [quary, setQuary] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [canFind, setCanFind] = useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setIsLoading(true);
    getMovie(quary)
      .then((response) => {
        const data = response;

        if ('Error' in data) {
          setMovie(null);
          setCanFind(true);
        } else {
          const recievedMovie: Movie = {
            title: data.Title,
            description: data.Plot,
            imgUrl: data.Poster,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
            imdbId: data.imdbID,
          };

          setMovie(recievedMovie);
        }
      })
      .catch(() => {
        setMovie(null);
        setCanFind(true);
      })
      .finally(() => setIsLoading(false));
  };

  const handlerAddingMovie = (): void => {
    if (movie) {
      onClickAdd(movie);
      setQuary('');
      setMovie(null);
    }
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
              className="input is-dander"
              value={quary}
              onChange={(event) => {
                setQuary(event.target.value);
                setCanFind(false);
              }}
            />
          </div>

          {canFind && (
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
              className={classNames(
                'button',
                'is-light',
                { 'is-loading': isLoading },
              )}
              disabled={quary.length === 0}
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
                onClick={handlerAddingMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && (
        <div
          className="container"
          data-cy="previewContainer"
        >
          <h2 className="title">
            Preview
          </h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
