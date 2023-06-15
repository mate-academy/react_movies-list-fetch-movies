import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';

type Props = {
  movies: Movie[],
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

const defaultPoster
    = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadMovie = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await getMovie(title);

      if ('Error' in response) {
        setError(true);
      } else {
        const loadedMovie: Movie = {
          title: response.Title,
          description: response.Plot,
          imdbId: response.imdbID,
          imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
          imgUrl: response.Poster === 'N/A'
            ? defaultPoster
            : response.Poster,
        };

        setMovie(loadedMovie);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const addMovieHandler = () => {
    if (movie
        && !movies.find((currentMovie) => movie.title === currentMovie.title)
    ) {
      setMovies(
        prevMovies => [...prevMovies, movie],
      );
    }

    setTitle('');
    setMovie(null);
    setError(false);
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
              className={classNames('input', { 'is-danger': error })}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError(false);
              }}
            />
          </div>
          {error && (
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
              disabled={title.length === 0}
              className={classNames('button is-light',
                { 'is-loading': loading })}
              onClick={(event) => loadMovie(event)}
            >
              {movie ? 'Search again' : 'Find a movie'}

            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovieHandler}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </>
        </div>
      )}
    </>
  );
};
