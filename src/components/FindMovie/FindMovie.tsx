import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: CallableFunction,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [currentMovie, setCurrentMovie] = useState<Movie>();
  const [inputFieldIsInit, setInputFieldIsInit] = useState(false);
  const [isFoundError, setIsFoundError] = useState(false);

  const findMovie = async (title: string) => {
    setInputFieldIsInit(false);
    setIsFoundError(false);

    const searchResult = await getMovie(title);

    setCurrentMovie(searchResult);

    if (searchResult.Response === 'False') {
      setInputFieldIsInit(false);
      setQuery('');
      setIsFoundError(true);

      return;
    }

    setQuery('');
    setIsFoundError(false);
    setInputFieldIsInit(false);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          findMovie(query);
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
              className={`
                input
                ${inputFieldIsInit && !query ? 'is-danger' : ''}
              `}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setInputFieldIsInit(true);
                setIsFoundError(false);
              }}
              onFocus={() => setIsFoundError(false)}
              onBlur={() => setInputFieldIsInit(true)}
            />
          </div>

          {inputFieldIsInit && !query && (
            <p className="help is-danger">
              Enter a movie title
            </p>
          )}

        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              data-cy="find"
              className="button is-light"
              onClick={() => {
                findMovie(query);
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              data-cy="add"
              className="button is-primary"
              onClick={() => {
                addMovie(currentMovie);
                setQuery('');
                setInputFieldIsInit(false);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {currentMovie?.Response === 'True' && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={currentMovie} />
          </>
        )}

        {isFoundError && (
          <h2 className="title is-danger">
            Movie not found!
          </h2>
        )}
      </div>
    </>
  );
};
