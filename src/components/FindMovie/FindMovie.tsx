import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';

type Prop = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Prop> = ({ addMovie }) => {
  const [searchWord, setSearchWord] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [errorMessage, setErrorMessage] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value);
    if (errorMessage) {
      setErrorMessage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(false);

    try {
      const data = await getMovie(searchWord);

      if ('Error' in data) {
        setErrorMessage(true);
      } else {
        const newMovie = {
          title: data.Title,
          description: data.Plot,
          imgUrl:
            data.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : data.Poster,
          imdbUrl: 'https://www.imdb.com/title/' + data.imdbID,
          imdbId: data.imdbID,
        };

        setMovie(newMovie);
      }
    } catch (error) {
      setErrorMessage(true);
    } finally {
      setLoading(false);
    }
  };

  const addToMovieList = () => {
    if (movie) {
      addMovie(movie);
      setSearchWord('');
      setMovie(null);
      setErrorMessage(false);
    }
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
              className={classNames('input', { 'is-danger': errorMessage })}
              value={searchWord}
              onChange={handleSearchInput}
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
              disabled={!searchWord}
            >
              {!loading && movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>
          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addToMovieList}
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
