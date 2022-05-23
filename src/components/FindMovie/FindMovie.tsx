import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useState,
} from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [queryError, setQueryError] = useState('');

  const changeQuery = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setQueryError('');
  }, []);

  const onFindMovie = useCallback(() => {
    if (!query.trim()) {
      setQueryError('Please enter a title');
    } else {
      const findMovie = async () => {
        const result = await getMovie(query);

        if (result.Response === 'True') {
          setMovie(result);
          setQueryError('');
        } else {
          setQueryError('Can not find a movie with such a title');
        }
      };

      findMovie();
    }
  }, [query]);

  const onAddMovie = useCallback((event: FormEvent) => {
    event.preventDefault();

    if (!queryError && movie) {
      addMovie(movie);
      setMovie(null);
      setQuery('');
    }
  }, [movie, queryError]);

  return (
    <>
      <form className="find-movie" onSubmit={onAddMovie}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input"
              value={query}
              onChange={changeQuery}
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
              onClick={onFindMovie}
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
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
