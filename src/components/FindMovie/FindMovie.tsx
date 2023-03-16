import { FC, useState } from 'react';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  error: {
    error: boolean,
    setIsErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
  },
  preview: {
    preview: boolean,
    setIsPreview: React.Dispatch<React.SetStateAction<boolean>>,
  },
  movie: Movie | null,
  isLoading: boolean,
  onFindMovie: (value: string) => void,
  addMovie: () => void,
};

export const FindMovie: FC<Props> = ({
  error,
  preview,
  movie,
  isLoading,
  onFindMovie,
  addMovie,
}) => {
  const [valueInput, setValueInput] = useState<string>('');

  const hendlerInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueInput(e.currentTarget.value);
    error.setIsErrorMessage(false);
  };

  const hendlerFindMovie = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    onFindMovie(valueInput);
  };

  const addMovieToList = () => {
    setValueInput('');
    addMovie();
    preview.setIsPreview(false);
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
              value={valueInput}
              onChange={hendlerInput}
            />
          </div>

          {error.error && (
            <p
              className="help is-danger"
              data-cy="errorMessage"
            >
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
              disabled={valueInput === ''}
              onClick={hendlerFindMovie}
            >
              {!movie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {preview.preview && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovieToList}
              >
                Add to the list
              </button>
            </div>
          )}

        </div>
      </form>

      {preview.preview && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie || null} />
        </div>
      )}
    </>
  );
};
