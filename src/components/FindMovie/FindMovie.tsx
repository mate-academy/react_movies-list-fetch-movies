import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
// import { Movie } from '../../types/Movie';
// import { getMovie } from '../../api';

// type Props = {
//   movies: Movie[];
//   setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
// };

export const FindMovie: React.FC = (
  // movies,
  // setMovies,
) => {
  const [value, setValue] = useState('');

  // const addMovie = (newMovie: Movie) => {
  //   setMovies([...movies, newMovie]);
  // }

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </div>

          <p className="help is-danger" data-cy="errorMessage">
            Can&apos;t find a movie with such a title
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn('button', 'is-light')}
              disabled={value.length === 0}
              // onClick={() => {}}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {/* <MovieCard movie={movie} /> */}
      </div>
    </>
  );
};
