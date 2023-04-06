import classNames from 'classnames';
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { getMovie, NormalizeMovieData } from '../../api';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type FindMovieProps = {
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<FindMovieProps> = ({ addMovie }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    getMovie(query)
      .then((data) => {
        if ((data as MovieData).imdbID) {
          setMovie(NormalizeMovieData(data as MovieData));
        } else {
          setErrorMessage(true);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAddingMovie = (movietoAdd: Movie) => {
    addMovie(movietoAdd);
    setQuery('');
    setMovie(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
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
              className={classNames(
                'input',
                { 'is-dander': errorMessage },
              )}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setErrorMessage(false);
              }}
              ref={inputRef}
            />
          </div>
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
              onClick={handleSubmit}
              disabled={query.length === 0 || undefined}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddingMovie(movie)}
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

      {errorMessage && (
        <p className="help is-danger" data-cy="errorMessage">
          Can&apos;t find a movie with such a title
        </p>
      )}
    </>
  );
};
