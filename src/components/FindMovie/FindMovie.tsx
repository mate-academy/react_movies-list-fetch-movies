import classNames from 'classnames';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  onAddMovies: Movie[]
  setMovies: Dispatch<SetStateAction<Movie[]>>
};

export const FindMovie: React.FC<Props> = ({ onAddMovies, setMovies }) => {
  const [query, setQuery] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  function isError(a: MovieData | ResponseError): a is ResponseError {
    return (a as ResponseError).Error !== undefined;
  }

  const normalizedMovie = (data: MovieData): Movie => {
    return (
      {
        title: data.Title,
        description: data.Plot,
        imgUrl: data.Poster !== 'N/A'
          ? data.Poster
          : 'https://via.placeholder.com/360x270.png?text=no%20preview',
        imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
        imdbId: data.imdbID,
      }
    );
  };

  const fetchData = async () => {
    setIsLoading(true);
    const data = await getMovie(query);
    // const x = isError(data);

    // console.log(query);
    // console.log('TRUE OR FALSE with isError', x);
    setErrorMessage(isError(data));
    if (!isError(data)) {
      setMovie(normalizedMovie(data));
    }

    setIsLoading(false);
  };

  const handleQuery = (e: string) => {
    setErrorMessage(false);
    setQuery(e);
  };

  const handleFindMovie = () => {
    fetchData();
  };

  const handleAddToList = () => {
    setQuery('');

    const isMovieInList = onAddMovies
      .find(existMovie => existMovie.imdbId === movie?.imdbId);

    setMovies(movie && !isMovieInList
      ? (a: Movie[]) => [...a, movie] : onAddMovies);

    setMovie(null);
  };

  // console.log(movie);

  return (
    <>
      <form className="find-movie" onSubmit={event => event.preventDefault()}>
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
              onChange={(e) => handleQuery(e.target.value)}
            />
          </div>

          {errorMessage
          && (
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
              className={classNames(
                'button is-light',
                { 'is-loading': isLoading },
              )}
              onClick={handleFindMovie}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          {movie
          && (
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

      {movie
      && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
