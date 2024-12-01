import { FC, useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { getNormalizedMovie } from '../../helpers';
import { MovieData } from '../../types/MovieData';

interface Props {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const findMovie = (event: React.FormEvent) => {
    event.preventDefault();
    const preparedQuery = searchQuery.toLowerCase().trim();

    setIsLoading(true);

    getMovie(preparedQuery)
      .then((movieData) => {
        if ('Response' in movieData && movieData.Response === 'False') {
          setIsError(true);
        } else {
          const normalizedMovie = getNormalizedMovie(movieData as MovieData);

          setMovie(normalizedMovie);
          setIsError(false);
        }
      })
      .catch(() => {
        setIsError(true);
        setMovie(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAddButton = () => {
    if (movie) {
      addMovie(movie);
      setSearchQuery('');
      setMovie(null);
    } else {
      // eslint-disable-next-line no-useless-return
      return;
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setSearchQuery(value);

    if (isError && value !== '') {
      setIsError(false);
    }
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
              className={cn('input', {
                'is-danger': isError,
              })}
              value={searchQuery}
              onChange={handleInputChange}
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
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
              onClick={findMovie}
              disabled={!searchQuery.trim()}
            >
              {movie
                ? 'Search again'
                : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddButton}
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
