import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

type Props = {
  addMovie: (newMovie:Movie) => void;
};

export const FindMovie: React.FC<Props> = (props) => {
  const { addMovie } = props;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [isFound, setIsFound] = useState(true);

  const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setTitle(value);
    setIsFound(true);
  };

  const loadMovie = async () => {
    const loadedMovie = await getMovie(title);

    if (loadedMovie.Response === 'False') {
      setMovie(null);
      setIsFound(false);

      return;
    }

    setIsFound(true);

    setMovie({
      title: loadedMovie.Title,
      description: loadedMovie.Plot,
      imgUrl: loadedMovie.Poster,
      imdbUrl: `https://www.imdb.com/title/${loadedMovie.imdbID}`,
      imdbId: loadedMovie.imdbID,
    });

    setTitle('');
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              value={title}
              onChange={handleChange}
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': !isFound })}
            />
          </div>

          {!isFound && (
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
              onClick={loadMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                if (movie !== null) {
                  addMovie(movie);
                }

                setMovie(null);
              }}
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
