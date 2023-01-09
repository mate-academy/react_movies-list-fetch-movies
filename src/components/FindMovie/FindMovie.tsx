import {
  ChangeEvent,
  FC,
} from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

interface Props {
  handleTtitleSubmit: (event:ChangeEvent<HTMLFormElement>) => void;
  title: string;
  handleTitleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isTitleCorrect: boolean;
  movie: Movie | null;
  isLoading: boolean;
  handleAddToList: () => void;
}

export const FindMovie: FC<Props> = ({
  handleTtitleSubmit,
  title,
  handleTitleChange,
  isTitleCorrect,
  movie,
  isLoading,
  handleAddToList,
}) => {
  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleTtitleSubmit}
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
              onChange={handleTitleChange}
            />
          </div>

          {
            !isTitleCorrect
            && (
              <p className="help is-danger" data-cy="errorMessage">
                Can&apos;t find a movie with such a title
              </p>
            )
          }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn(
                'button',
                'is-light',
                { 'is-loading': isLoading },
              )}
              disabled={!title}
            >
              {
                !movie
                  ? 'Find a movie'
                  : 'Search again'
              }
            </button>
          </div>

          {
            movie
              && (
                <div className="control">
                  <button
                    data-cy="addButton"
                    type="button"
                    className="button is-primary"
                    onClick={handleAddToList}
                  >
                    Add to the list
                  </button>
                </div>
              )
          }
        </div>
      </form>

      {
        movie
          && (
            <div className="container" data-cy="previewContainer">
              <h2 className="title">Preview</h2>
              {
                movie
                && <MovieCard movie={movie} />
              }
            </div>
          )
      }
    </>
  );
};
