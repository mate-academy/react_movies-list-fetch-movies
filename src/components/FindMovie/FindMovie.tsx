import classNames from 'classnames';
import React, { Dispatch, useState } from 'react';
import { searchMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

// import { MovieCard } from '../MovieCard';
interface Props {
  movies: Movie[];
  setMovies: Dispatch<Movie[]>;
}

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [titleMovie, setTitleMovie] = useState('');
  const [current, setCurrent] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [movieHere, setMovieHere] = useState(false);
  const [defaulText, setDefaultText] = useState(true);
  const [activeButon, setActiveButton] = useState(false);

  const getMovie = (title: string) => {
    searchMovie(title)
      .then(result => {
        if (result.Response !== 'True') {
          setCurrent(null);
          setError(true);

          return null;
        }

        return (setCurrent(result),
        setDefaultText(false),
        setMovieHere(false),
        setActiveButton(true));
      });
  };

  const addToList = () => {
    if (movies.some(movie => movie.imdbID === current?.imdbID)) {
      setCurrent(null);
      setMovieHere(true);
      setDefaultText(false);
      setActiveButton(false);
    } else if (current !== null) {
      setActiveButton(false);
      setMovies([...movies, current]);
      setCurrent(null);
      setDefaultText(true);
      setTitleMovie('');
    }
  };

  const serchButtonApprove = (
    event: { target: { value: React.SetStateAction<string>; }; },
  ) => {
    setError(false);
    setTitleMovie(event.target.value);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          getMovie(titleMovie);
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
              className={classNames(
                'input',
                {
                  'is-danger': error,
                },
              )}
              value={titleMovie}
              onChange={serchButtonApprove}
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
              type="submit"
              className="button is-light"
              data-cy="find"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className={classNames(
                'button is-primary',
                {
                  'is-static': !activeButon,
                },
              )}
              onClick={addToList}
              data-cy="add"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movieHere && (
          <p className="subtitle is-5 has-text-danger-dark m-3">
            This movie already in your library
          </p>
        )}
        {current && (
          <MovieCard movie={current} />
        )}
        {defaulText && (
          <p className="subtitle is-6 m-3">
            Choose a movie
          </p>
        )}
      </div>
    </>
  );
};
