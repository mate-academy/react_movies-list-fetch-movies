import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  movie: Movie | null;
  value: string;
  onSearch: () => void;
  onAddMovie: (movie: Movie) => void;
  onChange: (newValue: string) => void;
  isLoading: boolean;
  error: string | null;
  hasPreview: boolean;
};

export const FindMovie: React.FC<Props> = ({
  value,
  movie,
  onSearch,
  onAddMovie,
  onChange,
  isLoading,
  error,
  hasPreview,
}: Props) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
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
              className={`input ${error ? 'input is-danger' : ''}`}
              value={value}
              onChange={event => onChange(event.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              {error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              disabled={isLoading || !value.trim()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {hasPreview && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => movie && onAddMovie(movie)}
                disabled={!hasPreview || isLoading}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          {movie && <MovieCard movie={movie} />}
        </div>
      )}
    </>
  );
};
