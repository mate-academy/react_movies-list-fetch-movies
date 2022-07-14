import React, { useCallback, useState } from 'react';
import classnames from 'classnames';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

interface FindMovieProps {
  onAddMovie: (newMovie: Movie | null) => void;
}

export const FindMovie: React.FC<FindMovieProps> = ({ onAddMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [movieError, setMovieError] = useState('');
  const [isRequired, setIsRequired] = useState(false);

  const loadMovie = useCallback(
    async () => {
      const receivedMovie = await fetch(`https://www.omdbapi.com/?apikey=4e85fbc0&t=${title}`)
        .then(response => response.json());

      if (receivedMovie.Response === 'True') {
        setMovieError('');
        setMovie(receivedMovie);
      } else {
        setMovieError(receivedMovie.Error);
        setMovie(null);
      }
    }, [title],
  );

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();

    if (title) {
      loadMovie();
    } else {
      setIsRequired(true);
    }
  }, [title]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setMovieError('');
    setIsRequired(false);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          handleSubmit(event);
        }}
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
              className={classnames(
                'input',
                { 'is-danger': isRequired },
              )}
              value={title}
              onChange={(event) => {
                handleChange(event);
              }}
              onFocus={() => setIsRequired(true)}
            />
          </div>

          <p className="help is-danger">
            {
              movieError
            }
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
              disabled={!title}
              data-cy="find"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              data-cy="add"
              type="button"
              className="button is-primary"
              disabled={!title}
              onClick={() => {
                onAddMovie(movie);
                setTitle('');
                setMovie(null);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {
          movie
            ? (<MovieCard movie={movie} />)
            : (movieError)
        }
      </div>
    </>
  );
};
