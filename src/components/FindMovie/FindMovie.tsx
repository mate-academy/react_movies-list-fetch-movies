import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  query: string,
  setQuery: (event: string) => void,
  getMovieData: (title: string) => void,
  isError: boolean,
  movie: Movie | null,
  addNewMovie: () => void,
  isLoading: boolean,
  clickedButton: boolean,
};

export const FindMovie: React.FC<Props> = ({
  query,
  setQuery,
  getMovieData,
  isError,
  movie,
  addNewMovie,
  isLoading,
  clickedButton,
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
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-dander"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          {isError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={query.length === 0}
              data-cy="searchButton"
              type="submit"
              className={
                classNames(('button is-light'), { 'is-loading': isLoading })
              }
              onClick={(event) => {
                event.preventDefault();
                getMovieData(query);
              }}
            >
              {clickedButton ? 'Find a movie' : 'Search again' }
            </button>
          </div>

          {movie !== null && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => addNewMovie()}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie !== null && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
