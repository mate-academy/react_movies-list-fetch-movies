import React, { useState } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import classNames from 'classnames';

interface Props {
  onChangeMovies: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ onChangeMovies }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<MovieData | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFindMovie = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsLoading(true);
    getMovie(query)
      .then(result => {
        if ('Error' in result) {
          setIsError(true);
          setMovie(null);
        } else {
          setIsError(false);
          setMovie(result);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const normalizeMovie = (movieData: MovieData | null): Movie => {
    const res: Movie = {
      title: '',
      description: '',
      imgUrl: '',
      imdbId: '',
      imdbUrl: '',
    };

    if (movieData === null) {
      return res;
    }

    res.title = movieData.Title ?? '';
    res.description = movieData.Plot ?? '';
    res.imgUrl =
      movieData.Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : movieData.Poster;
    res.imdbId = movieData.imdbID ?? '';
    res.imdbUrl = 'https://www.imdb.com/title/' + movieData.imdbID;

    return res;
  };

  const handleAddMovie = () => {
    setMovie(null);
    onChangeMovies(normalizeMovie(movie));
    setQuery('');
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
              className={classNames('input', {
                'is-danger': isError,
              })}
              value={query}
              onChange={event => {
                setIsError(false);
                setQuery(event.target.value);
              }}
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
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={query.trim() === '' ? true : false}
              onClick={handleFindMovie}
            >
              Find a movie
            </button>
          </div>

          {movie !== null && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie !== null && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={normalizeMovie(movie)} />
        </div>
      )}
    </>
  );
};
