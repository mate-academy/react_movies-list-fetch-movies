import React, { useEffect, useRef, useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';

type Props = {
  addMovieToTheList: (movie: Movie) => void;
};

const defaultPoster =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<Props> = ({ addMovieToTheList }) => {
  const [query, setQuery] = useState('');
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const titleInput = useRef<null | HTMLInputElement>(null);

  const movieIsNotFound = !foundMovie && hasError;

  const reset = () => {
    setFoundMovie(null);
    setHasError(false);
  };

  const focusTitleInput = () => {
    if (titleInput.current) {
      titleInput.current.focus();
    }
  };

  const findMovieByTitle = (title: string) => {
    setIsLoading(true);
    reset();

    getMovie(title)
      .then(result => {
        if ('Response' in result && result.Response === 'False') {
          throw new Error();
        }

        const { Poster, Title, Plot, imdbID } = result as MovieData;
        const imgPoster = Poster === 'N/A' ? defaultPoster : Poster;

        const newMovie: Movie = {
          title: Title,
          description: Plot,
          imdbId: imdbID,
          imgUrl: imgPoster,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
        };

        setFoundMovie(newMovie);
      })
      .catch(() => {
        setHasError(true);
        focusTitleInput();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasError(false);
    setQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    findMovieByTitle(query);
  };

  const handleAddClick = () => {
    if (foundMovie) {
      addMovieToTheList(foundMovie);
      reset();
      setQuery('');
      focusTitleInput();
    }
  };

  useEffect(() => {
    focusTitleInput();
  }, []);

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              ref={titleInput}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', {
                'is-danger': movieIsNotFound,
              })}
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          {movieIsNotFound && (
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
              className={cn('button is-light', { 'is-loading': isLoading })}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          {foundMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddClick}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {foundMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
