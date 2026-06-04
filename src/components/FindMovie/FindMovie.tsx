import React, { ChangeEvent, FormEvent, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';

type Props = {
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState('');
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [hasFoundError, setHasFoundError] = useState(false);
  const [hasDuplicateError, setHasDuplicateError] = useState(false);
  const [isPreviewShown, setIsPreviewShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const normalizeMovie = (data: MovieData): Movie => {
    return {
      title: data.Title,
      description: data.Plot,
      imgUrl: data.Poster === 'N/A' ? '' : data.Poster,
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
      imdbId: data.imdbID,
    };
  };

  async function handlerSearchMovie(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const fetchedMovie = await getMovie(query);

      if (fetchedMovie && fetchedMovie.Response !== 'False') {
        setFoundMovie(normalizeMovie(fetchedMovie as MovieData));
        setIsPreviewShown(true);
      } else {
        setHasFoundError(true);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handlerChangeQuery(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    setHasFoundError(false);
    setHasDuplicateError(false);
  }

  function handleAddMovie() {
    if (movies.some(currMovie => currMovie.imdbId === foundMovie?.imdbId)) {
      setQuery('');
      setIsPreviewShown(false);
      setFoundMovie(null);
      setHasDuplicateError(true);

      return;
    }

    setMovies(prevMovies => [...prevMovies, foundMovie]);
    setIsPreviewShown(false);
    setQuery('');
  }

  return (
    <>
      <form className="find-movie" onSubmit={handlerSearchMovie}>
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
              className={classNames('input', { isDanger: hasFoundError })}
              value={query}
              onChange={handlerChangeQuery}
            />
          </div>

          {hasFoundError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}

          {hasDuplicateError && (
            <p className="help is-danger" data-cy="errorMessage">
              This movie is already in your list
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
              disabled={!query}
            >
              {isPreviewShown ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {isPreviewShown && foundMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddMovie()}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {isPreviewShown && foundMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
