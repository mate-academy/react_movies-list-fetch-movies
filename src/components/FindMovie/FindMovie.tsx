import React, { useCallback, useState, FormEvent } from 'react';
import './FindMovie.scss';
import { getMovies } from '../../api/api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
  isExist: (movie: Movie) => boolean;
};

export const FindMovie: React.FC<Props> = ({ addMovie, isExist }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState('');

  const reset = () => {
    setMovie(null);
    setTitle('');
  };

  const onFind = useCallback(async () => {
    if (!title.trim()) {
      setTitle('');
      setError('Wrong title. Please try again.');
    } else {
      const result = await getMovies(title);

      if (result.Response !== 'False') {
        setMovie(result);
      } else {
        setError('Title is not exist.');
        setMovie(null);
      }
    }
  }, [movie, title]);

  const onSend = useCallback((e: FormEvent) => {
    e.preventDefault();

    if (!error && movie) {
      addMovie(movie);
      reset();
    }
  }, [movie, error]);

  const onAddMovie = () => {
    if (movie && !isExist(movie)) {
      addMovie(movie);
      reset();
    } else if (!movie) {
      setError('Something wrong. Please try again.');
    }

    if (movie && isExist(movie)) {
      setError('Movie already in the list');
    }
  };

  const onAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setError('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={onSend}>
        <div className="field">
          <label className="label" htmlFor="movie-title">Movie title</label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input"
              value={title}
              onChange={onAdd}
            />
          </div>

          {error && (<p className="help is-danger">{error}</p>)}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={onFind}
              data-cy="find"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              onClick={onAddMovie}
              data-cy="add"
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
