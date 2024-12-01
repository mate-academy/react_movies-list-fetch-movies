import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';

interface FindMovieProps {
  setMoviesList: (movies: Movie[]) => void,
  moviesList: Movie[]
}

export const FindMovie: React.FC<FindMovieProps> = ({
  setMoviesList,
  moviesList,
}) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<MovieData | ResponseError | undefined>();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(false);
    setQuery(e.target.value);
  };

  const handleAddButton = (newMovie: Movie) => {
    if (!moviesList.find(
      movieFromList => movieFromList.imdbId === newMovie.imdbId,
    )) {
      setMoviesList([...moviesList, newMovie]);
    }

    setMovie(undefined);
    setQuery('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    getMovie(query)
      .then(res => ('Title' in res ? setMovie(res) : setIsError(true)))
      .finally(() => setIsLoading(false));
  };

  const transformMovieData = (data: MovieData) => {
    const poster = data.Poster === 'N/A'
      ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
      : data.Poster;

    return {
      title: data.Title,
      description: data.Plot,
      imgUrl: poster,
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
      imdbId: data.imdbID,
    };
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              value={query}
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': isError,
              })}
              onChange={handleChange}
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
              className={classNames('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={query === ''}
            >
              Find a movie
            </button>
          </div>

          {movie !== undefined && 'Title' in movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddButton(transformMovieData(movie))}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie !== undefined && 'Title' in movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={transformMovieData(movie)} />
        </div>
      )}
    </>
  );
};
