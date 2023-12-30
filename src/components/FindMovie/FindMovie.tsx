import React, { useCallback, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface Props {
  movies: Movie[]
  setMovies: (c: Movie[]) => void
}

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [error, setError] = useState(false);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState<null | Movie>(null);

  const handleInputTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setError(false);
    setTitle(value);
  };

  const normalizeMovieData = (data: MovieData): Movie => {
    const {
      Title,
      Plot,
      Poster,
      imdbID,
    } = data;
    const BASE_MOVIE_URL = 'https://www.imdb.com/title';

    return {
      title: Title,
      description: Plot,
      imgUrl: Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : Poster,
      imdbUrl: `${BASE_MOVIE_URL}/${imdbID}`,
      imdbId: imdbID,
    };
  };

  const handleSubmit = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setLoading(true);
    getMovie(title)
      .then((data) => {
        if ('Error' in data) {
          throw new Error();
        }

        return data;
      })
      .then(normalizeMovieData)
      .then(setMovie)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [title]);

  const handleAddMovie = () => {
    if (
      !movies.some((savedMovie) => savedMovie.imdbId === movie?.imdbId)
      && movie !== null
    ) {
      setMovies([...movies, movie]);
    }

    setTitle('');
    setMovie(null);
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
              onChange={handleInputTitleChange}
            />
          </div>

          {
            error && (
              <p className="help is-danger" data-cy="errorMessage">
                Can&apos;t find a movie with such a title
              </p>
            )
          }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': loading,
              })}
              onClick={handleSubmit}
              disabled={title.trim().length <= 0}
            >
              Find a movie
            </button>
          </div>

          {
            movie !== null && (
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
            )
          }
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {
          movie !== null && (
            <MovieCard movie={movie} />
          )
        }
      </div>
    </>
  );
};
