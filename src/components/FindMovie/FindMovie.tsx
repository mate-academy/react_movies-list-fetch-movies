import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { getMovie } from '../../api';

type Props = {
  movies: Movie[];
  onAddToList: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({
  movies,
  onAddToList,
}) => {
  const [previevMovie, setPrevievMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [noMovieFound, setNoMovieFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [badRequest, setBadRequest] = useState(false);

  const isResponseError = useCallback((
    response: MovieData | ResponseError,
  ): response is ResponseError => {
    return (response as ResponseError).Response === 'False';
  }, []);

  const loadMovie = useCallback(async (searchItem: string) => {
    const foundMovie = await getMovie(searchItem);

    if (isResponseError(foundMovie)) {
      setNoMovieFound(true);
      setIsLoading(false);

      return;
    }

    const {
      Title,
      Plot,
      imdbID,
      Poster,
    } = foundMovie as MovieData;

    setPrevievMovie({
      title: Title,
      description: Plot,
      imdbId: imdbID,
      imgUrl: Poster
        || 'https://via.placeholder.com/360x270.png?text=no%20preview',
      imdbUrl: `https://www.imdb.com/title/${imdbID}/`,
    });
    setNoMovieFound(false);
    setIsLoading(false);
  }, []);

  const handleSearchByQuery = useCallback((searchItem: string) => {
    loadMovie(searchItem);
  }, [loadMovie]);

  const handleSetQuery = (event:React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleAddToList = () => {
    if (!movies.find(movie => movie.imdbId === previevMovie?.imdbId)) {
      onAddToList(previevMovie as Movie);
    }

    setPrevievMovie(null);
    setQuery('');
  };

  const handleLoading = () => {
    setIsLoading(true);
  };

  if (query && query.trim().length === 0) {
    setBadRequest(true);
  } else {
    setBadRequest(false);
  }

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          handleSearchByQuery(query);
          event.preventDefault();
          handleLoading();
        }}
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
              onChange={handleSetQuery}
            />
          </div>

          {(noMovieFound || badRequest) && (
            <p className="help is-danger" data-cy="errorMessage">
              {badRequest
                ? 'Put the right movie name'
                : 'Can&apos;t find a movie with such a title'}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!query.trim()}
            >
              {previevMovie ? 'Search again' : 'Find a movie'}
            </button>

          </div>

          {previevMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddToList}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {previevMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={previevMovie} />
        </div>
      )}
    </>
  );
};
