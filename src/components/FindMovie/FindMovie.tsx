import React from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { Spinner } from '../Spinner/Spinner';

interface Props {
  movie: Movie | null;
  find: () => void;
  onInputChange: (title:string) => void;
  addMovieToTheList: () => void;
  defaultTitle: string;
  notFound:boolean;
  isLoading:boolean;
}

export const FindMovie: React.FC<Props> = ({
  movie,
  find,
  onInputChange,
  addMovieToTheList,
  notFound,
  defaultTitle,
  isLoading,
}) => {
  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={notFound ? 'input is-danger' : 'input'}
              value={defaultTitle}
              onChange={
                (e) => onInputChange(e.target.value)
              }
            />
          </div>

          {
            notFound && (
              <p className="help is-danger">
                Can&apos;t find a movie with such a title
              </p>
            )
          }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              data-cy="find"
              className="button is-light"
              onClick={() => find()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              data-cy="add"
              className="button is-primary"
              onClick={() => addMovieToTheList()}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {isLoading
        ? <Spinner />
        : movie && (
          <div className="container">
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </div>
        )}
    </>
  );
};
