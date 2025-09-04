import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  onSubmit: (query: string) => void;
  query: string;
  setQuery: (value: string) => void;
  movie: Movie | null;
  addMovie: (newMovie: Movie) => void;
  setMovie: React.Dispatch<React.SetStateAction<Movie | null>>;
  isError: boolean;
  isSearched: boolean;
  setIsSearched: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
};

export const FindMovie: React.FC<Props> = ({
  onSubmit,
  query,
  setQuery,
  movie,
  addMovie,
  setMovie,
  isError,
  isSearched,
  setIsSearched,
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
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              // `input is-danger`
              className={!isError ? 'input' : 'input is-danger'}
              value={query}
              onChange={event => {
                setQuery(event.target.value);
              }}
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
              data-cy="searchButton"
              type="submit"
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              onClick={event => {
                event.preventDefault();
                onSubmit(query);
              }}
              disabled={query.trim() === '' || isLoading}
            >
              {isSearched ? 'Search again' : 'Find a movie'}
            </button>
          </div>
          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  if (movie) {
                    addMovie(movie);
                    setMovie(null);
                    setQuery('');
                    setIsSearched(false);
                  }
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>

        {movie && <MovieCard movie={movie as Movie} />}
      </div>
    </>
  );
};
