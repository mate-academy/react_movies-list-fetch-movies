import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import getMovieByTitle from '../../services/getMovieByTitle';
import getIMDBUrlById from '../../utils/getIMDBUrlById';
import { isResponseError } from '../../types/ReponseError';
import { DEFAULT_IMAGE } from '../../constants';

interface Props {
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>,
}

export const FindMovie: React.FC<Props> = ({
  setMovies,
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isSearching) {
      const preparedTitle = query.trim();

      getMovieByTitle(preparedTitle)
        .then(response => {
          if (isResponseError(response)) {
            setErrorMessage('Can\'t find a movie with such a title');
          } else {
            const {
              imdbID, Title, Plot, Poster,
            } = response;

            const preparedMovie: Movie = {
              imdbId: imdbID,
              title: Title,
              description: Plot,
              imgUrl: (Poster !== 'N/A' ? Poster : DEFAULT_IMAGE),
              imdbUrl: getIMDBUrlById(imdbID),
            };

            setMovie(preparedMovie);
          }

          setIsSearching(false);
        })
        .catch(() => {
          setIsSearching(false);
          setErrorMessage('Fix your internet');
        });
    }
  }, [isSearching]);

  const addMovieToList = () => {
    if (movie) {
      setMovies(prevMovies => {
        const hasThisMovie = prevMovies.some(
          currMovie => currMovie.imdbId === movie.imdbId,
        );

        setQuery('');
        setMovie(null);

        if (hasThisMovie) {
          setErrorMessage('This movie is already listed');

          return prevMovies;
        }

        setErrorMessage('');

        return [...prevMovies, movie];
      });
    }
  };

  const tryFindMovie = () => {
    setIsSearching(true);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentQuery = event.target.value;

    if (!currentQuery.trim()) {
      setErrorMessage('Enter the name of the movie');
    } else {
      setErrorMessage('');
    }

    setQuery(event.target.value);
  };

  return (
    <>
      <form className="find-movie" onSubmit={(e) => e.preventDefault()}>
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
              className={`input ${errorMessage && 'is-danger'}`}
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          {errorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={`button is-light ${isSearching && 'is-loading'}`}
              disabled={isSearching || query.trim() === ''}
              onClick={tryFindMovie}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                disabled={isSearching}
                onClick={addMovieToList}
              >
                Add to the list
              </button>
            </div>
          )}
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
