import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';

import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

function normalizeMovieData(data: MovieData): Movie {
  return {
    title: data.Title || 'Unknown Title',
    description: data.Plot || 'No description available',
    imgUrl: data.Poster !== 'N/A'
      ? data.Poster
      : 'https://via.placeholder.com/360x270.png?text=no%20preview',
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    imdbId: data.imdbID || 'Unknown IMDb ID',
  };
}

type Props = {
  movies: Movie[],
  setMovies: (newMovies: Movie[]) => void
};

export const FindMovie: React.FC<Props> = ({
  movies,
  setMovies = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [titleHasError, setTitleHasError] = useState(false);
  const [query, setQuery] = useState('');

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setTitleHasError(false);
  };

  const handleOnSubmit = () => {
    setLoading(true);

    if (query.trim() !== '') {
      getMovie(query)
        .then((data: MovieData | ResponseError) => {
          if ('Title' in data) {
            const foundMovie = data.Title.toLowerCase()
              .includes(query.toLowerCase());

            if (!foundMovie) {
              setTitleHasError(true);
              setMovie(null);
            } else {
              setMovie(normalizeMovieData(data as MovieData));
            }
          } else if ('Error' in data) {
            setTitleHasError(true);
            setMovie(null);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setMovie(null);
    }
  };

  const listIncludesMovie = () => {
    return movies.some(m => m.imdbId === movie?.imdbId);
  };

  const handleAddClick = () => {
    if (movie && !listIncludesMovie()) {
      setMovies([...movies, movie]);
    }

    setQuery('');
    setMovie(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          handleOnSubmit();
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
              className={`input ${!loading && !movie && titleHasError && query && ('is-danger')}`}
              value={query}
              onChange={handleQueryChange}
            />
          </div>
          {!loading && !movie && titleHasError && query && (
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
              className={`${loading ? 'button is-loading' : 'button is-light'}`}
              onClick={handleOnSubmit}
              disabled={!query}
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
                onClick={handleAddClick}
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

          <MovieCard movie={movie as Movie} />

        </div>
      )}
    </>
  );
};
