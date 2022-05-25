import React, {
  useCallback,
  useState,
  FormEvent,
} from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

interface Props {
  addMovie: (movie: Movie) => void,
  movieInTheList: (movie: Movie) => boolean;
}

export const FindMovie: React.FC<Props> = (props) => {
  const {
    addMovie,
    movieInTheList,
  } = props;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [errorText, setErrorText] = useState('');
  const [title, setTitle] = useState('');

  const onAddMovie = useCallback((event: FormEvent) => {
    event.preventDefault();

    if (movie && !errorText) {
      if (movieInTheList(movie)) {
        addMovie(movie);
        setMovie(null);
        setErrorText('');
      }
    }
  }, [movie, errorText]);

  const onFindMovieTitle = useCallback(async () => {
    if (!title.trim()) {
      setErrorText('Enter a movie title, please');
    } else {
      const foundMovie = await getMovie(title);

      if (foundMovie.Response === 'True') {
        setMovie(foundMovie);
      } else {
        setErrorText('There are no movies with such a title');
      }
    }
  }, [title, errorText]);

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
              className="input is-danger"
              value={title}
              onChange={(event => {
                setTitle(event.target.value);
              })}
            />
          </div>

          {errorText && (
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
              onClick={onFindMovieTitle}

            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={onAddMovie}
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
