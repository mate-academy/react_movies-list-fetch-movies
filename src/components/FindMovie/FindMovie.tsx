import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import './FindMovie.scss';

import { Movie } from '../../interfaces/Movie';
import { Preview } from '../Preview/Preview';

type FormData = {
  title: string;
};

type Props = {
  isMovieFound: boolean;
  requestMovie(title: string): void;
  preview: Movie | null;
  isLoading: boolean;
  addMovie(): void;
};

export const FindMovie: FC<Props> = ({
  isMovieFound,
  requestMovie,
  preview,
  isLoading,
  addMovie,
}) => {
  const {
    register,
    errors,
    reset,
    handleSubmit,
  } = useForm<FormData>();

  const onSubmit = handleSubmit(({ title }) => {
    requestMovie(title.trim());
  });

  const handleClick = () => {
    addMovie();
    reset();
  };

  const isError = !isMovieFound || errors.title;

  return (
    <>
      <form className="find-movie" onSubmit={onSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${isError && 'is-danger'}`}
              ref={register({
                required: true,
                pattern: /\w+/,
              })}
              name="title"
            />
          </div>
          {
            errors.title && errors.title.type === 'required' && (
              <p className="help is-danger">
                This field is required
              </p>
            )
          }
          {
            !errors.title && !isMovieFound && (
              <p className="help is-danger">
                Can&apos;t find a movie with such a title
              </p>
            )
          }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleClick}
              disabled={preview === null}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        <Preview
          isLoading={isLoading}
          preview={preview}
        />
      </div>
    </>
  );
};
