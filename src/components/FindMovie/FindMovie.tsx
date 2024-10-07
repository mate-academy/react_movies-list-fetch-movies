import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
// import { MovieData } from '../../types/MovieData';
// import { ResponseError } from '../../types/ReponseError';
import { Loader } from '../Loader';
import { Movie } from '../../types/Movie';

type Props = {
  addMovie?: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = () => {
  const [query, setQuery] = useState('');
  const [value, setValue] = useState('');
  const [titleError, setTitleError] = useState(false);
  // const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchClick, setSearchClick] = useState(false);

  const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setQuery(newValue);
    setValue(newValue);
    setTitleError(false);
  };

  const searchMovie = () => {
    setSearchClick(true);
    setLoading(true);

    getMovie(query)
      .then(result => {
        // eslint-disable-next-line
        console.log(result);
        if ('Error' in result) {
          setTitleError(true);
        } else {
          // setMovieData(result as MovieData);
          setPreview(true);
        }
      })
      .finally(() => setLoading(false));
  };

  const addMovieFunction = () => {
    // addMovie(movieValue);
    setQuery('');
    setPreview(false);
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
              value={value}
              onChange={event => {
                inputChange(event);
              }}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': titleError })}
            />
          </div>

          {titleError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>
        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              onClick={() => searchMovie()}
              type="submit"
              className="button is-light"
              disabled={!value}
            >
              {loading && <Loader />}
              {!loading && !searchClick && 'Find a movie'}
              {!loading && searchClick && 'Search again'}
            </button>
          </div>

          <div className="control">
            {preview && (
              <button
                data-cy="addButton"
                type="button"
                onClick={() => {
                  addMovieFunction();
                }}
                className="button is-primary"
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {preview && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          {/* <MovieCard movie={movie} /> */}
        </div>
      )}
    </>
  );
};

// if (result as ResponseError) {
//   setTitleError(true);
// } else {
//   setMovieData(result as MovieData);
// }
