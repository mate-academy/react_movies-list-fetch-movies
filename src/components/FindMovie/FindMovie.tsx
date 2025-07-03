import React, { useState } from 'react';
import cn from 'classnames';

import './FindMovie.scss';

import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';

import { getMovie } from '../../api';

import { MovieCard } from '../MovieCard';

type FindMovieProps = {
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<FindMovieProps> = ({ setMovies }) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);

  const normalizedMovie = (data: MovieData): Movie => {
    return {
      title: data.Title,
      description: data.Plot,
      imgUrl:
        data.Poster !== 'N/A'
          ? data.Poster
          : 'https://via.placeholder.com/360x270.png?text=no%20preview',
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
      imdbId: data.imdbID,
    };
  };

  function addToTheList(newMovie: Movie) {
    setMovies(prev => {
      const alreadyAdd = prev.some(mov => mov.imdbId === newMovie.imdbId);

      if (alreadyAdd) {
        return prev;
      }

      return [...prev, newMovie];
    });
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setMovie(null);

    try {
      const result = await getMovie(title);

      if ('Error' in result) {
        setErrorMessage("Can't find a movie with such a title");
      } else {
        setMovie(normalizedMovie(result));
      }
    } catch (error) {
      setErrorMessage("Can't find a movie with such a title");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMovie = () => {
    if (!movie) {
      return;
    }

    addToTheList(movie);
    setMovie(null);
    setTitle('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
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
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                setErrorMessage('');
              }}
            />
          </div>

          {errorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn('button', 'is-light', { 'is-loading': isLoading })}
              disabled={!title || isLoading}
            >
              Find a movie
            </button>
          </div>
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
          <button
            data-cy="addButton"
            type="button"
            className="button is-primary"
            onClick={handleAddMovie}
          >
            Add to the list
          </button>
        </div>
      )}
    </>
  );
};
