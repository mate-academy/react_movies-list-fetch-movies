import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

type Props = {
  movies: Movie[],
  onMoviesChange: (movies: Movie[]) => void,
};

const emptyImg = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<Props> = ({ movies, onMoviesChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadingError, setHasLoadingError] = useState(false);
  const [movie, setMovie] = useState<Movie>();

  function isAMovieData(obj: MovieData | ResponseError | undefined) {
    if (!obj) {
      return false;
    }

    return 'Poster' in obj && 'Title' in obj
      && 'Plot' in obj && 'imdbID' in obj;
  }

  function movieDataToMovie(movieData: MovieData): Movie {
    const movieFromServer: Movie = {
      title: movieData.Title,
      description: movieData.Plot,
      imgUrl: movieData.Poster === 'N/A'
        ? emptyImg
        : movieData.Poster,
      imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
      imdbId: movieData.imdbID,
    };

    return movieFromServer;
  }

  const loadMovie = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      const movieDataFromServer = await getMovie(searchQuery);

      if (!isAMovieData(movieDataFromServer)) {
        throw new Error('Invalid response');
      }

      const movieFromServer = movieDataToMovie(
        movieDataFromServer as MovieData,
      );

      setMovie(movieFromServer);
    } catch {
      setHasLoadingError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMovieSave = () => {
    if (movie && !movies.find(m => m.imdbId === movie.imdbId)) {
      onMoviesChange([...movies, movie]);
    }

    setSearchQuery('');
    setMovie(undefined);
    setIsLoading(false);
    setHasLoadingError(false);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={loadMovie}
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
              className="input is-dander"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setHasLoadingError(false);
              }}
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
                'button',
                'is-light',
                { 'is-loading': isLoading },
              )}
              disabled={searchQuery === ''}
            >
              {movie ? 'Serach again' : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleMovieSave}
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
