import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isMovieFetching, setIsMovieFetching] = useState(false);
  const submitButtonText = movie ? 'Search Again' : 'Find a movie';

  const getMovieFromResponse = (response: MovieData | ResponseError) => {
    if ('Error' in response) {
      setHasError(true);

      return null;
    }

    const imgUrl = response.Poster === 'N/A'
      ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
      : response.Poster;
    const imdbUrl = `https://www.imdb.com/title/${response.imdbID}`;

    const selectedMovie: Movie = {
      title: response.Title,
      description: response.Plot,
      imgUrl,
      imdbUrl,
      imdbId: response.imdbID,
    };

    setHasError(false);

    return selectedMovie;
  };

  const getMovieByName = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setIsMovieFetching(true);

    const response = await getMovie(query);

    try {
      const foundMovie = getMovieFromResponse(response);

      setMovie(foundMovie);
    } catch (error) {
      getMovieFromResponse(response);
    } finally {
      setIsMovieFetching(false);
    }
  };

  const handleAddMovie = (searchMovie: Movie) => {
    addMovie(searchMovie);
    setMovie(null);
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
              className="input is-dander"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setHasError(false);
              }}
            />
          </div>
          {hasError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': isMovieFetching,
              })}
              onClick={getMovieByName}
              disabled={!query}
            >
              {submitButtonText}
            </button>
          </div>
          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddMovie(movie)}
              >
                Add to the list
              </button>
            </div>
          ) }
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
