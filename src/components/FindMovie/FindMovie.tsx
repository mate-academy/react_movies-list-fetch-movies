import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Movie } from '../../types/Movie';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import { IMDB_URL_BASE, TEMPORARY_POSTER } from '../../utils/Constants';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [searchFieldValue, setSearchFieldValue] = useState<string>('');
  const [searchName, setSearchName] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const searchField = useRef<HTMLInputElement | null>(null);

  const handlerChangeSearchField = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const inputValue = e.target.value;

    if (inputValue.length > 0) {
      setIsError(false);
    }

    setSearchFieldValue(inputValue);
  };

  const handlerSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchName(searchFieldValue);
  };

  const handlerReceivedData = (data: MovieData) => {
    const {
      imdbID,
      Poster,
      Plot,
      Title,
    } = data;

    const newMovie = {
      title: Title,
      description: Plot,
      imgUrl: Poster === 'N/A' ? TEMPORARY_POSTER : Poster,
      imdbUrl: (IMDB_URL_BASE + imdbID),
      imdbId: imdbID,
    };

    setMovie(newMovie);
  };

  const handlerAddMovie = () => {
    if (movie) {
      onAdd(movie);
      setMovie(null);
      setSearchFieldValue('');
      setSearchName('');
    }
  };

  useEffect(() => {
    if (searchField.current) {
      searchField.current.focus();
    }
  }, []);

  useEffect(() => {
    if (searchName) {
      setIsSearching(true);

      getMovie(searchName)
        .then(json => {
          if (json.Response === 'True') {
            handlerReceivedData(json);
          } else {
            setIsError(true);
          }
        })
        .finally(() => {
          setIsSearching(false);
        });
    }
  }, [searchName]);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(e) => handlerSubmitSearch(e)}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              ref={searchField}
              value={searchFieldValue}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', { 'is-danger': isError })}
              onChange={handlerChangeSearchField}
            />
          </div>

          {isError && (
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
              className={cn(
                'button',
                { 'is-light': !isSearching },
                { 'is-loading': isSearching },
              )}
              disabled={searchFieldValue.length < 1}
            >
              {searchName ? (
                'Search again'
              ) : (
                'Find a movie'
              )}
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handlerAddMovie}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          {movie && (
            <MovieCard movie={movie} />
          )}
        </div>
      )}
    </>
  );
};
