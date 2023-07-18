import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

const movieTemplate = {
  title: '',
  description: '',
  imgUrl: '',
  imdbUrl: '',
  imdbId: '',
};

export const FindMovie: React.FC<{
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>
}> = ({ setMovies }) => {
  const [movie, setMovie] = useState<Movie>(movieTemplate);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const searchFilm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    getMovie(inputValue)
      .then((foundMovie) => {
        const {
          Poster,
          Title,
          Plot,
          imdbID,
        } = foundMovie as MovieData;

        setMovie((prevState) => {
          return {
            ...prevState,
            imgUrl: Poster,
            title: Title,
            description: Plot,
            imdbId: imdbID,
          };
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleFilm = () => {
    if (movie.title === undefined) {
      setMovies((prevMovie) => {
        if (prevMovie.some(film => film.imdbId === movie.imdbId)) {
          return prevMovie;
        }

        return [...prevMovie, movie];
      });
    }

    setInputValue('');
    setMovie(movieTemplate);
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
              className="input is-danger"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>

          { movie.title === undefined && (
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
              className={classNames('button is-light',
                { 'is-loading': isLoading })}
              onClick={searchFilm}
            >
              Find a movie
            </button>
          </div>

          { inputValue && movie.title === undefined && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleFilm}
              >
                Add to the list
              </button>
            </div>
          )}

        </div>
      </form>
      {movie.title === undefined && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
