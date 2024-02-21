import React, { useState } from 'react';
import cn from 'classnames';
import { Movie } from '../../types/Movie';
import './FindMovie.scss';
import { getMovie } from '../../api';

export const FindMovie: React.FC = () => {
  const [query, setQuery] = useState('');
  const [foundMovie, setFoundMovie] = useState<Movie>({
    title: '',
    description: '',
    imgUrl: '',
    imdbUrl: '',
    imdbId: '',
  });

  const findMovieTittle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const lookForMovie = () => {
    getMovie(query).finally(() => setFoundMovie);
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
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', {
                'is-danger': !foundMovie,
              })}
              onChange={findMovieTittle}
              value={query}
            />
          </div>

          {!foundMovie && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className="button is-light"
              onClick={lookForMovie}
            >
              Find a movie
            </button>
          </div>

          {!foundMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {/* <MovieCard movie={movie} /> */}
      </div>
    </>
  );
};

// useEffect(() => {
//   getMovie(query)
//     .then(set???);
// }, []);
