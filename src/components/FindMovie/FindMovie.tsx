import React, { useCallback, useState } from 'react';
import './FindMovie.scss';

import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [movie,  setMovie] = useState<Movie | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setHasError(false);
  }

  const submitForm =  useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setIsLoading(true);

      getMovie(title).then(response => {
        if ('Error' in response) {
          setHasError(true);
        } else {
          setMovie({
            title: response.Title,
            description: response.Plot,
            imgUrl: response.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : response.Poster,
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
            imdbId: response.imdbID,
          });
        }
      }).finally(() => setIsLoading(false));
    }, [getMovie, title],
  );

  return (
    <>
      <form 
        className="find-movie"
        onSubmit={submitForm}
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
              onChange={handleInput}
            />
          </div>

          {hasError && (
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
                'button is-light',
                { 'is-loading': isLoading },
              )}
              disabled={title.length === 0}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            {title && movie && <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
              onClick={() => {
                addMovie(movie);
                setTitle('');
                setMovie(null)
              }}
            >
              Add to the list
            </button>}
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        {movie 
          && <><h2 className="title">Preview</h2>
          <MovieCard movie={movie} /></>
        }
      </div>
    </>
  );
};
