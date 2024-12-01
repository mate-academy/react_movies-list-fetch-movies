import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import cn from 'classnames';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const dafaultMovie = {
    title: '',
    description: '',
    imgUrl: '',
    imdbUrl: '',
    imdbId: '',
  };
  const [searchMovie, setSearchMovie] = useState('');
  const [errorSearch, setErrorSearch] = useState(false);
  const [loadingMovie, setLoadingMovie] = useState(false);
  const [newMovie, setNewMovie] = useState<Movie>(dafaultMovie);

  const getMovieFromServer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoadingMovie(true);
    getMovie(searchMovie.trim().replace(/\s/g, '+'))
      .then(movie => {
        if ('Title' in movie) {
          setNewMovie({
            title: movie.Title,
            description: movie.Plot,
            imgUrl:
              movie.Poster === 'N/A'
                ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                : movie.Poster,
            imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
            imdbId: movie.imdbID,
          });
          if (errorSearch) {
            setErrorSearch(false);
          }
        } else {
          setErrorSearch(true);
        }
      })
      .finally(() => setLoadingMovie(false));
  };

  const hundleAddMovie = () => {
    addMovie(newMovie);
    setNewMovie(dafaultMovie);
    setSearchMovie('');
    setErrorSearch(false);
  };

  const hundleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchMovie(e.target.value);
    if (errorSearch) {
      setErrorSearch(false);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={getMovieFromServer}>
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
              className={cn('input', { 'is-danger': errorSearch })}
              value={searchMovie}
              onChange={hundleSearch}
            />
          </div>

          {errorSearch && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={!searchMovie.trim()}
              data-cy="searchButton"
              type="submit"
              className={cn('button', 'is-light', {
                'is-loading': loadingMovie,
              })}
            >
              Find a movie
            </button>
          </div>

          {newMovie.title && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={hundleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {newMovie.title && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={newMovie} />
        </div>
      )}
    </>
  );
};
