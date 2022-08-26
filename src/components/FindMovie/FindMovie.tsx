import React, { FormEvent, useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';

interface Props {
  addMovie: (m: Movie) => void,
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(title)
      .then(response => {
        if ('Error' in response) {
          return Promise.reject();
        }

        const {
          Poster,
          Title,
          Plot,
          imdbID,
        } = response as MovieData;

        setMovie({
          title: Title,
          description: Plot,
          imdbId: imdbID,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imgUrl: Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : Poster,
        });

        return Promise.resolve();
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  };

  const clearForm = () => {
    setTitle('');
    setMovie(null);
  };

  const addNewMovie = () => {
    if (!movie) {
      return;
    }

    addMovie(movie);
    clearForm();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    if (error) {
      setError(false);
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
              value={title}
              onChange={handleChange}
            />
          </div>

          {error && (
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
              className={classNames('button is-light',
                { 'is-loading': isLoading })}
              disabled={!title}
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
                onClick={addNewMovie}
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
