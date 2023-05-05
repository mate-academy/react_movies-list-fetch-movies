import React, { useState, useEffect } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import { IMDB_URL, IMG_URL } from '../../constants';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<MovieData | ResponseError>();
  const [movie, setMovie] = useState<Movie>();
  const [isError, setIsError] = useState<boolean>();
  const [isSearched, setIsSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const sendRequest = (value: string) => {
    getMovie(value)
      .then(res => {
        setResponse(res);
      })
      .finally(() => setIsLoading(false));
  };

  // eslint-disable-next-line
  function checkResponse(obj: any): obj is MovieData {
    if (obj.Response === 'False') {
      return false;
    }

    return true;
  }

  const saveMovie = (movieData: MovieData) => {
    const {
      Title, Plot, Poster, imdbID,
    } = movieData;

    setMovie(() => ({
      title: Title,
      description: Plot,
      imgUrl: Poster === 'N/A' ? IMG_URL : Poster,
      imdbUrl: IMDB_URL + imdbID,
      imdbId: imdbID,
    }));
  };

  useEffect(() => {
    if (response) {
      if (checkResponse(response)) {
        saveMovie(response);
      } else {
        setIsError(true);
        setMovie(undefined);
      }
    }
  }, [response]);

  const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDisabled(() => !e.target.value);
    setIsError(false);
    setQuery(() => e.target.value);
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(() => true);
    setIsSearched(() => true);
    sendRequest(query);
  };

  const onAddClick = () => {
    if (movie) {
      addMovie(movie);
    }

    setQuery('');
    setIsSearched(false);
    setMovie(undefined);
    setIsDisabled(() => true);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={onFormSubmit}
      >
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
              className="input is-dander"
              value={query}
              onChange={onQueryChange}
            />
          </div>

          { isError && (
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
              disabled={isDisabled}
              className={`button is-light${isLoading ? ' is-loading' : ''}`}
            >
              {!isSearched && 'Find a movie'}
              {isSearched || isLoading ? 'Search again' : ''}
            </button>
          </div>

          <div className="control">
            {(movie && !isError && isSearched)
            && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={onAddClick}
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
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
