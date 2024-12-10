import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';

type Props = {
  addNewMovie: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addNewMovie }) => {
  const [title, setTitle] = useState<string>('');
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChangeTitle(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
    setErrorMessage(false);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    getMovie(title)
      .then(response => {
        if ('Response' in response && response.Response === 'False') {
          setErrorMessage(true);
          setMovieData(null);
        } else {
          setErrorMessage(false);
          setMovieData(response as MovieData);
        }
      })
      .finally(() => setLoading(false));
  }

  const transformMovieData = (data: MovieData): Movie => ({
    title: data.Title,
    description: data.Plot,
    imgUrl: data.Poster === 'N/A' || !data.Poster 
    ? 'https://via.placeholder.com/360x270.png?text=no%20preview' 
    : data.Poster,
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    imdbId: data.imdbID,
  });

  function clear() {
    setTitle('');
    setMovieData(null);
  }

  return (
    <>
      <form className="find-movie" onSubmit={handleSearch}>
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
              className="input"
              value={title}
              onChange={handleChangeTitle}
            />
          </div>

          {errorMessage && (
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
                'is-loading': loading,
              })}
              disabled={!title}
            >
              {movieData ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            {movieData && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  addNewMovie(transformMovieData(movieData))
                  clear()
                }}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {movieData && (
        <div className="container" data-cy="previewContainer">
          <MovieCard movie={transformMovieData(movieData)} />
        </div>
      )}
    </>
  );
};
