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
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isNotFind, setIsNotFind] = useState<boolean>(false);
  const [alreadyAdded, setAlreadyAdded] = useState<boolean>(false);

  const searchFilm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsLoading(false);

    getMovie(inputValue)
      .then((foundMovie) => {
        const {
          Poster = 'https://via.placeholder.com/360x270.png?text=no%20preview',
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
            imdbUrl: `http://www.imdb.com/title/${imdbID}`,
          };
        });

        if (!Title || Title === movie.title) {
          setIsNotFind(true);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleFilm = () => {
    if (movie.title) {
      setMovies((prevMovie) => {
        if (prevMovie.some((film) => film.imdbId === movie.imdbId)) {
          setAlreadyAdded(true);

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
              className={classNames('input', {
                'is-danger': isNotFind && inputValue,
              })}
              value={inputValue}
              onFocus={() => setAlreadyAdded(false)}
              onChange={(e) => {
                setIsNotFind(false);
                setMovie(movieTemplate);
                setInputValue(e.currentTarget.value);
              }}
            />
          </div>

          {isNotFind && inputValue && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}

          {alreadyAdded && (
            <p className="help is-danger" data-cy="errorMessage">
              The movie has already been added
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              disabled={inputValue === ''}
              className={classNames('button is-light',
                { 'is-loading': isLoading })}
              onClick={searchFilm}
            >
              Find a movie
            </button>
          </div>

          { inputValue && movie.title && (
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
      { movie.title && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
