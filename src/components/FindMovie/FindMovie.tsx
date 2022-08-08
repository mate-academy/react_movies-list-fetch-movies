import React from 'react';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  onChangeInput: (query: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  searchMovie: (query: string) => void;
  movie: Movie | null;
  handleEvent: (event: React.FormEvent<HTMLFormElement>) => void;
  addMovie: () => void;
  notFound: boolean;
  isLoading: boolean;
};

export const FindMovie: React.FC<Props>
  = ({
    onChangeInput,
    title,
    searchMovie,
    movie,
    handleEvent,
    addMovie,
    notFound,
    isLoading,
  }) => {
    return (
      <>
        <form className="find-movie" onSubmit={handleEvent}>
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
                onChange={onChangeInput}
                value={title}
              />
            </div>

            {notFound && (
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
                  {
                    'is-loading': isLoading,
                  },
                )}
                disabled={title.length === 0}
                onClick={() => searchMovie(title)}
              >
                {movie ? 'Search again' : 'Find a movie'}
              </button>
            </div>

            {movie && (
              <div className="control">
                <button
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                  onClick={addMovie}
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
