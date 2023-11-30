import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import './FindMovie.scss';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

function normalizeMovieData(movieData: MovieData): Movie {
  const DEFAULT_POSTER_URL
    = 'https://via.placeholder.com/360x270.png?text=no%20preview';

  const imgUrl = movieData.Poster !== 'N/A'
    ? movieData.Poster : DEFAULT_POSTER_URL;

  return {
    title: movieData.Title,
    description: movieData.Plot,
    imgUrl,
    imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
    imdbId: movieData.imdbID,
  };
}

interface Props {
  movie: Movie | null,
  setMovie: (movie: Movie | null) => void,
  addMovie: (movie: Movie | null) => void,
}

export const FindMovie: React.FC<Props> = ({ movie, setMovie, addMovie }) => {
  const [title, setTitle] = useState('');
  const [isLoadingMovie, setIsLoadingMovie] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (title.trim()) {
        setIsLoadingMovie(true);

        const response: MovieData | ResponseError = await getMovie(title);

        if ('Error' in response) {
          setError(true);
        } else {
          setError(false);
          setMovie(normalizeMovieData(response));
        }
      }
    } catch (err) {
      setError(true);
    } finally {
      setIsLoadingMovie(false);
    }
  };

  const handleAddMovie = () => {
    addMovie(movie);
    setTitle('');
    setMovie(null);
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
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': error,
              })}
              // className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {error && title && (
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
                'is-loading': isLoadingMovie,
              })}
              disabled={!title}
            >
              {!movie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          <div className="control">
            {(error || movie) && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
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
