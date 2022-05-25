import React, { useState, useCallback, FormEvent } from 'react';
import './FindMovie.scss';
import { getMovies } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (a: Movie) => void
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState(null);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');

  const onFind = useCallback(() => {
    if (!title) {
      setTitleError('Title not entered');
    } else {
      const findMovie = async () => {
        const titleForServer = await getMovies(title);

        if (titleForServer.Response === 'True') {
          setMovie(titleForServer);
          setTitleError('');
        } else {
          setTitleError('No movie with this title');
        }
      };

      findMovie();
    }
  }, [title]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!titleError && movie) {
      addMovie(movie);
      setTitle('');
      setMovie(null);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(e) => handleSubmit(e)}
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
              onChange={((e) => {
                setTitle(e.target.value);
              })}
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
              onClick={onFind}
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
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
