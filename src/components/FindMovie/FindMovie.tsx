import React, { useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import './FindMovie.scss';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import { DEFAULT_IMG } from '../../utils';
import { Movie } from '../../types/Movie';

type Props = {
  onAddMovieBtn: (newMovie: Movie) => void;
  thisMovieExist: boolean
};

export const FindMovie: React.FC<Props> = ({
  onAddMovieBtn, thisMovieExist,
}) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [onLoading, setOnLoading] = useState(false);
  const [onError, setOnError] = useState(false);

  const createNewMovie = (foundMovieData:MovieData | null) => {
    if (foundMovieData !== null) {
      const {
        Poster,
        Title,
        Plot,
        imdbID,
      } = foundMovieData;

      const poster = Poster === 'N/A'
        ? DEFAULT_IMG
        : Poster;

      const newMovieItem = {
        title: Title,
        description: Plot,
        imgUrl: poster,
        imdbUrl: `https://www.imdb.com/title/${imdbID}`,
        imdbId: imdbID,
      };

      setMovie(newMovieItem);
      setOnLoading(false);
    }
  };

  const loadMovie = async (searchQuery:string) => {
    try {
      const responce = await getMovie(searchQuery);

      if ('Error' in responce) {
        throw new Error();
      } else {
        createNewMovie(responce);
        setOnError(false);
      }
    } catch (error) {
      setOnError(true);
    } finally {
      setOnLoading(false);
    }
  };

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOnLoading(true);
    loadMovie(query);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onError && query === e.target.value) {
      setOnError(true);
    } else {
      setOnError(false);
    }

    setQuery((prevQuery => {
      return prevQuery === e.target.value
        ? query
        : e.target.value;
    }));
  };

  const addMovie = (movieToAdd: Movie) => {
    if (thisMovieExist) {
      onAddMovieBtn(movieToAdd);
    }

    setMovie(null);
    setQuery('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={onSubmitHandler}>
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
              onChange={onInputChange}
            />
          </div>

          {onError && (
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
              className={classNames('is-light', 'button',
                { 'is-loading': onLoading })}
              disabled={query.trim() === ''}
            >
              {!movie
                ? 'Find a movie'
                : 'Search again'}
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => addMovie(movie)}
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
