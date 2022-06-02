import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useState,
} from 'react';
import './FindMovie.scss';

import { getMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');

  const changeTitle = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setTitleError('');
  }, []);

  const findMovie = useCallback(() => {
    if (!title.trim()) {
      setTitleError('Please enter a title');
    } else {
      const newMovie = async () => {
        const response = await getMovie(title);

        if (response.Response === 'True') {
          setMovie(response);
          setTitleError('');
        } else {
          setTitleError('Invalid title, can not find such a film');
        }
      };

      newMovie();
    }
  }, [title]);

  const onAddMovie = useCallback((event: FormEvent) => {
    event.preventDefault();

    if (!titleError && movie) {
      addMovie(movie);
      setMovie(null);
      setTitle('');
    }
  }, [movie, titleError]);

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
              value={title}
              onChange={changeTitle}
              className="input is-danger"
            />
          </div>

          {titleError && (
            <p className="help is-danger">
              {titleError}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={findMovie}
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
