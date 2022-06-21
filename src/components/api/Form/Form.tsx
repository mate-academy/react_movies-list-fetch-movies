import classNames from 'classnames';
import { useState } from 'react';
import { request } from '../request';

interface Props {
  callbackForMovies : (arg0 : Movie[]) => void;
  prevMovies: Movie[];
  setPrev : (arg0 : Movie | null) => void;
  prev : Movie | null;
}

export const Form : React.FC<Props> = (
  {
    callbackForMovies, prevMovies, setPrev, prev,
  },
) => {
  const [movieForFind, setMovieForFind] = useState('');
  const [isFilmValid, setIsFilmValid] = useState(true);

  async function finder() {
    const result = await request(movieForFind.toLowerCase());

    if (result.Response !== 'False') {
      setPrev(result);
    } else {
      setPrev(null);
      setIsFilmValid(false);
    }
  }

  return (

    <form
      className="find-movie"
      onSubmit={(event) => {
        event.preventDefault();
        if (prev) {
          if (!prevMovies.find(el => el.imdbID === prev.imdbID)) {
            callbackForMovies([...prevMovies, prev]);
            setPrev(null);
            setMovieForFind('');
          }
        }
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
            value={movieForFind}
            className={classNames('input', { 'is-danger': !isFilmValid })}
            onChange={(event) => {
              setMovieForFind(event.target.value);
              if (!isFilmValid) {
                setIsFilmValid(true);
              }
            }}
          />
        </div>

        { !isFilmValid
          && (
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
            onClick={() => {
              finder();
            }}
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
  );
};
