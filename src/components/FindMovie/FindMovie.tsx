import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  movies: Movie[]
  setMovies: (movies: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [title, setTitle] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const handlerFindMovie = (event: React.FormEvent) => {
    event.preventDefault();
    setLoaded(true);
    getMovie(title.trim())
      .then(result => {
        if ('Title' in result) {
          const {
            Poster, Title, Plot, imdbID,
          } = result;

          const newMovie: Movie = {
            title: Title,
            description: Plot,
            imgUrl: Poster !== 'N/A' ? Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            imdbId: imdbID,
          };

          setMovie(newMovie);
        } else {
          setIsError(true);
        }
      })
      .finally(() => {
        setLoaded(false);
      });
  };

  const handlerInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsError(false);
  };

  const handlerAddMovie = () => {
    if (movie && !movies.some(m => m.imdbId === movie.imdbId)) {
      setMovies([...movies, movie]);
    }

    setTitle('');
    setMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handlerFindMovie}>
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
              className={classNames('input', { 'is-danger': isError })}
              onChange={handlerInput}
              value={title}
            />
          </div>

          {isError
            && (
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
              disabled={!title}
              className={
                classNames('button is-light', { 'is-loading': loaded })
              }
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie
              && (
                <button
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                  onClick={handlerAddMovie}
                >
                  Add to the list
                </button>
              )}
          </div>
        </div>
      </form>

      {movie
        && (
          <div className="container" data-cy="previewContainer">
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </div>
        )}
    </>
  );
};
