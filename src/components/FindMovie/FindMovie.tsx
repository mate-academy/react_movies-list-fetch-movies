import React, { useState } from 'react';
import cn from 'classnames';

import { getMovie } from '../../api';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import { SearchButtonText } from '../../types/SearchButtonText';
import { PosterURL } from '../../types/PosterURL';

const imdbUrl = 'https://www.imdb.com/title/';

type Props = {
  saveNewMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ saveNewMovie }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hasError, setHasError] = useState(false);
  const [buttonText, setButtonText] = useState(SearchButtonText.Find);

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setHasError(false);
  };

  const findMovie = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    getMovie(query.trimEnd())
      .then(response => {
        if ('imdbID' in response) {
          const {
            Plot, Poster, Title, imdbID,
          } = response as MovieData;

          setMovie({
            title: Title,
            description: Plot,
            imgUrl:
              Poster !== PosterURL.None
                ? Poster
                : PosterURL.Dafault,
            imdbUrl: `${imdbUrl}${imdbID}`,
            imdbId: imdbID,
          });

          setButtonText(SearchButtonText.FindAgain);
        } else {
          setHasError(true);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const addMovie = () => {
    if (movie) {
      saveNewMovie(movie);
      setQuery('');
      setMovie(null);
      setButtonText(SearchButtonText.Find);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={findMovie}
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
              className={cn(
                'input',
                { 'is-danger': hasError },
              )}
              value={query}
              onChange={handleChangeTitle}
            />
          </div>

          {hasError && (
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
                'button is-light',
                {
                  'is-loading': isLoading,
                },
              )}
              disabled={!query}
            >
              {buttonText}
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovie}
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
