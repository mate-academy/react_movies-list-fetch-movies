import cn from 'classnames';
import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useState,
} from 'react';
import { request } from '../../api/api';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addMovie: (x: Movie) => void;
};

enum Errors {
  Initial = '',
  NotFount = 'Can not find a movie with this title',
  Required = 'Enter the title!',
  Find = 'Find a movie for the first',
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [queryError, setQueryError] = useState(Errors.Initial);

  const handleQuery = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setQueryError(Errors.Initial);
  }, []);

  const onFind = useCallback(() => {
    if (!query.trim()) {
      setQueryError(Errors.Required);
    } else {
      const findMovie = async () => {
        const result = await request(query);

        if (result.Response !== 'False') {
          setMovie(result);
          setQueryError(Errors.Initial);
        } else {
          setQueryError(Errors.NotFount);
        }
      };

      findMovie();
    }
  }, [query]);

  const onAdd = useCallback((event: FormEvent) => {
    event.preventDefault();

    if (!movie) {
      setQueryError(Errors.Find);
    }

    if (!queryError && movie) {
      addMovie(movie);
      setMovie(null);
      setQuery('');
    }
  }, [movie, queryError]);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={onAdd}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', { 'is-danger': queryError })}
              value={query}
              onChange={handleQuery}
            />
          </div>

          {queryError && (
            <p className="help is-danger">
              {queryError}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={onFind}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard
            movie={movie}
          />
        </div>
      )}
    </>
  );
};
