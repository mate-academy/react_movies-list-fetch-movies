import React, { ChangeEvent, FormEvent, useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  function submitTitle(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsLoading(true);
    getMovie(title)
      .then(result => {
        if (Object.hasOwn(result, 'Error')) {
          throw new Error("Can't find a movie with such a title");
        }

        const { Title, Poster, Plot, imdbID } = result as MovieData;

        setMovie({
          title: Title,
          imdbId: imdbID,
          imgUrl:
            Poster !== 'N/A'
              ? Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          description: Plot,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
        });
      })
      .catch(error => {
        setErrorMessage(error.message);
      })
      .finally(() => setIsLoading(false));
  }

  function handleMovie(newMovie: Movie) {
    addMovie(newMovie);
    setTitle('');
    setMovie(null);
  }

  function handleTitle(e: ChangeEvent<HTMLInputElement>) {
    setErrorMessage('');
    setTitle(e.target.value);
  }

  return (
    <>
      <form className="find-movie" onSubmit={submitTitle}>
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
              className={classNames('input', {
                'is-danger': errorMessage,
              })}
              value={title}
              onChange={handleTitle}
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
              disabled={title.length === 0}
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
                onClick={() => handleMovie(movie)}
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
