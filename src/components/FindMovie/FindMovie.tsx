import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovieByTitle } from '../../api/api';
import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [movieNotFound, setMovieNotFound] = useState(false);

  const titleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMovieNotFound(false);
    setTitle(event.target.value);
  };

  const hadleFindMovie = async () => {
    try {
      const movieFromServer = await getMovieByTitle(title);

      setMovie(movieFromServer);
    } catch {
      setMovie(null);
      setMovieNotFound(true);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (movie) {
      addMovie(movie);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames('input', {
                  'is-danger': movieNotFound,
                })}
                value={title}
                onChange={titleChange}
              />
            </div>
          </label>
          {movieNotFound && (
            <p className="help is-danger">
              {`Can't find a movie with such a title ${title}`}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={hadleFindMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleSubmit}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
