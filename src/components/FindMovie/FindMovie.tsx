import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addMovie: (movie: Movie | null) => void;
  movies: Movie[];
};

function isMovieDuplicate(arrayMovies: Movie[], movie: Movie): boolean {
  return arrayMovies.some(({ imdbId }) => imdbId === movie.imdbId);
}

export const FindMovie: React.FC<Props> = ({
  addMovie,
  movies,
}) => {
  const [query, setQuery] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const queryLength = query.trim().length;

  const handleSearchChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => (
    setQuery(value)
  );

  const handleClickFind = async () => {
    const data = await getMovie(query);

    if ('Error' in data) {
      setIsLoaded(true);
      setIsError(true);

      return;
    }

    setMovie({
      title: data.Title,
      description: data.Plot,
      imgUrl: data.Poster,
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
      imdbId: data.imdbID,
    });

    setIsLoaded(true);
    setIsError(false);
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
              className="input is-dander"
              value={query}
              onChange={handleSearchChange}
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
              className={classNames(
                'button',
                'is-light',
                { 'is-loading': !isLoaded },
                { finally: isLoaded },
              )}
              disabled={queryLength === 0}
              onClick={(event) => {
                event.preventDefault();

                setIsLoaded(false);

                if (!query) {
                  setIsLoaded(true);

                  return;
                }

                handleClickFind();
              }}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  if (!isMovieDuplicate(movies, movie)) {
                    addMovie(movie);
                  }

                  setMovie(null);
                  setQuery('');
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {movie && (
          <MovieCard movie={movie} />
        )}
      </div>
    </>
  );
};
