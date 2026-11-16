import React, { ChangeEvent, FormEvent, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
  movies: Movie[];
};

export const FindMovie = ({ setMovies, movies }: Props) => {
  const [title, setTitle] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [movie, setMovie] = useState<Movie | null>();

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsError(false);
  };

  const handleAddMovieToMoviesList = (newMovie: Movie) => {
    if (
      newMovie !== null &&
      !movies.find(mov => mov.imdbId === newMovie.imdbId)
    ) {
      setMovies(prev => [...prev, newMovie]);
    }

    setMovie(null);
    setTitle('');
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoad(true);

    getMovie(title)
      .then(data => {
        if ('Title' in data) {
          const newMovie: Movie = {
            title: data.Title,
            description: data.Plot,
            imdbId: data.imdbID,
            imgUrl: data.Poster,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          };

          setMovie(newMovie);
        } else {
          setIsError(true);
        }
      })
      .finally(() => setIsLoad(false));
  };

  return (
    <>
      <form className="find-movie" onSubmit={e => handleSubmit(e)}>
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
              onChange={e => handleTitleChange(e)}
              value={title}
            />
          </div>

          {isError && (
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
                'is-loading': isLoad,
              })}
              disabled={title.length === 0}
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
                onClick={() => handleAddMovieToMoviesList(movie)}
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
