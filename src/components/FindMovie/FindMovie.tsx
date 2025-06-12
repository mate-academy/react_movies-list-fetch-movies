import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import cn from 'classnames';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [isFindError, setIsFindError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [touched, setTouched] = useState(false);
  const [loader, setLoader] = useState(false);

  const changeQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFindError(false);
    setQuery(e.target.value);
  };

  const handleFind = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    let movieRecieved: Movie | null = null;

    setLoader(true);

    getMovie(query)
      .then(result => {
        if ((result as MovieData).Title !== undefined) {
          movieRecieved = {
            title: (result as MovieData).Title,
            description: (result as MovieData).Plot,
            imgUrl:
              ((result as MovieData).Poster !== 'N/A' &&
                (result as MovieData).Poster) ||
              'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbId: (result as MovieData).imdbID,
            imdbUrl: `https://www.imdb.com/title/${(result as MovieData).imdbID}`,
          };
          setIsFindError(false);
        } else {
          setIsFindError(true);
        }

        setMovie(movieRecieved);
      })
      .finally(() => setLoader(false));
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
              className={`input ${touched && query.length === 0 ? 'is-danger' : ''}`}
              value={query}
              onChange={changeQuery}
              onBlur={() => setTouched(true)}
            />
          </div>

          {isFindError && (
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
              className={cn('button', {
                'is-light': query.length > 0,
                'is-loading': loader,
              })}
              onClick={handleFind}
              disabled={query.length > 0 ? false : true}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  setMovie(null);
                  onAdd(movie);
                  setQuery('');
                }}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {movie !== null && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
