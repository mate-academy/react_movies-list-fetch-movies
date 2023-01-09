import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import './FindMovie.scss';

import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';

import { MovieCard } from '../MovieCard';

interface Props {
  onAdd: (movie: Movie) => void,
}

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [loadind, setLoading] = useState(false);
  const [loadedData, setLoadedData]
    = useState<MovieData | ResponseError | null>(null);
  const [isError, setIsError] = useState(false);
  const [newMovie, setNewMovie] = useState<Movie | null>(null);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const newData = await getMovie(query);

      setLoadedData(newData as MovieData);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    loadData();
  };

  useEffect(() => {
    if (loadedData) {
      const {
        Title,
        Poster,
        Plot,
        imdbID,
      } = loadedData as MovieData;

      const newDataMovie: Movie = {
        title: Title,
        description: Plot,
        imgUrl: Poster,
        imdbUrl: `https://www.imdb.com/title/${imdbID}`,
        imdbId: imdbID,
      };

      switch (Object.values(loadedData).every(el => el === undefined)) {
        case true:
          setIsError(true);
          break;

        case false:
          setNewMovie(newDataMovie);
          break;

        default:
          break;
      }
    }
  }, [loadedData]);

  useEffect(() => {
    setIsError(false);
  }, [query]);

  const addNewMovie = (movie: Movie) => {
    onAdd(movie);
    setNewMovie(null);
    setQuery('');
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
              className="input is-dander"
              value={query}
              onChange={handleSearch}
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
              className={classNames(
                'button is-light', { 'is-loading': loadind },
              )}
              disabled={query.length === 0}
            >
              Find a movie
            </button>
          </div>

          {newMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => addNewMovie(newMovie)}
              >
                Add to the list
              </button>
            </div>
          )}

        </div>
      </form>

      {newMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={newMovie} />
        </div>
      )}

    </>
  );
};
