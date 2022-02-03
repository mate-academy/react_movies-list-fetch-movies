import React, { useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  onAdd: (movie: Movie) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({ onAdd, movies }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState({
    Poster: '',
    Title: '',
    Plot: '',
    imdbID: '',
  });
  const [wasFound, setWasFound] = useState(true);
  const [hasPreview, setHasPreview] = useState(false);
  const [hasDuplicate, setHasDuplicate] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const loadMovie = async () => {
    const requestedMovie = await getMovie(title);

    if (requestedMovie.Response === 'True') {
      setWasFound(true);
      setMovie(requestedMovie);
      setHasPreview(true);
      setIsValid(true);
    } else {
      setWasFound(false);
    }
  };

  const findMovie = () => {
    if (!movie.Title.toLowerCase().includes(title.trim().toLowerCase())) {
      loadMovie();
    } else {
      setHasPreview(true);
      setIsValid(true);
    }
  };

  const addMovie = () => {
    const isDuplicate = movies.some(item => item.imdbID === movie.imdbID);

    if (!isDuplicate) {
      onAdd(movie);
      setHasPreview(false);
      setIsValid(false);
    } else {
      setHasDuplicate(true);
      setIsValid(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWasFound(true);
    setHasDuplicate(false);
    setHasPreview(false);
    setTitle(event.target.value);
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
              type="text"
              id="movie-title"
              value={title}
              placeholder="Enter a title to search"
              className={classNames(
                'input',
                { ' is-danger': (!wasFound || hasDuplicate) },
              )}
              onChange={handleChange}
            />
          </div>
          {!wasFound && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
          {hasDuplicate && (
            <p className="help is-danger">
              The movie is already in the list
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addMovie}
              disabled={!isValid}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {hasPreview && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
