import React, {
  useCallback,
  useState,
  FormEvent,
} from 'react';
import './FindMovie.scss';
import { getMovies } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');

  const onFindMovie = useCallback(() => {
    if (!title.trim()) {
      setError('Please enter a title');
    } else {
      const findMovie = async () => {
        const result = await getMovies(title);

        if (result.Response === 'True') {
          setMovie(result);
          setError('');
        } else {
          setError('Can not find a movie with such a title');
        }
      };

      findMovie();
    }
  }, [title]);

  const onAddMovie = useCallback((event: FormEvent) => {
    event.preventDefault();

    if (!error && movie) {
      addMovie(movie);
      setMovie(null);
      setError('');
    }
  }, [movie, error]);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={onAddMovie}
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
              className="input"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            />
          </div>

          {error && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
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
              disabled={!movie}
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
