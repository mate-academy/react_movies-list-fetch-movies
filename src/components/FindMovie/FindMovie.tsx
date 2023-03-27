import classNames from 'classnames';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

export function normalizeMovie(data: MovieData): Movie {
  const {
    Title,
    Plot,
    Poster,
    imdbID,
  } = data;

  // eslint-disable-next-line max-len
  const defaultPoster = 'https://via.placeholder.com/360x270.png?text=no%20preview';
  const imdbUrl = `https://www.imdb.com/title/${imdbID}`;

  return ({
    title: Title,
    description: Plot,
    imgUrl: Poster === 'N/A' ? defaultPoster : Poster,
    imdbUrl,
    imdbId: imdbID,
  });
}

type Props = {
  query: string,
  onSearch: (value: string) => void;
  onAddMovie: (newMovie: Movie) => void
};

export const FindMovie: React.FC<Props> = ({
  query,
  onSearch,
  onAddMovie,
}) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, isLoading] = useState(false);
  const [hasLoadingError, setLoadingError] = useState(false);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    onSearch(event.currentTarget.value);

    if (hasLoadingError && query) {
      setLoadingError(false);
    }
  };

  const handleFindMovie = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    isLoading(true);
    setLoadingError(false);

    const searchResult = await getMovie(query)
      .finally(() => isLoading(false));

    if (Object.prototype.hasOwnProperty.call(searchResult, 'Error')) {
      setLoadingError(true);
    } else {
      setMovie(normalizeMovie(searchResult as MovieData));
    }
  };

  const handleAddMovie = () => {
    if (movie) {
      onAddMovie(movie);
      setMovie(null);
    }
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
              onChange={(event) => handleSearch(event)}
            />
          </div>

          {hasLoadingError && (
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
                { 'is-loading': loading },
              )}
              disabled={!query}
              onClick={event => handleFindMovie(event)}
            >
              {movie ? 'Search again' : 'Find movie'}
            </button>
          </div>

          {movie && (
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

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};

// getMovie(query)
//   .then((movieData: MovieData) => {
//     const findedMovie: Movie = {
//       title: movieData.Title,
//       description: movieData.Plot,
//       imgUrl: movieData.Poster,
//       imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
//       imdbId: movieData.imdbID,
//     };

//     setMovie(findedMovie);

//     console.log(movieData);
//   });
