import React, { useState, useCallback } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import * as API from '../../api';

import { Movie } from '../../types/Movie';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd = () => {} }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');

  const searchMovie = useCallback((query: string) => {
    if (!query) {
      setMovie(null);

      return;
    }

    setIsSearching(true);

    API.getMovie(query)
      .then(data => {
        if ('Error' in data) {
          setMovie(null);
          setErrorText("Can't find a movie with such a title");
        } else {
          const movieData: Movie = {
            title: data.Title,
            description: data.Plot,
            imgUrl: data.Poster,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
            imdbId: data.imdbID,
          };

          if (movieData.imgUrl === 'N/A') {
            movieData.imgUrl =
              'https://via.placeholder.com/360x270.png?text=no%20preview';
          }

          setMovie(movieData);
        }
      })
      .finally(() => setIsSearching(false));
  }, []);

  const handleSearch = (query: string) => {
    setErrorText('');
    setSearchQuery(query);
  };

  const handleAdd = () => {
    if (!movie) {
      return;
    }

    onAdd(movie);
    setMovie(null);
    setSearchQuery('');
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
              value={searchQuery}
              placeholder="Enter a title to search"
              className={errorText ? 'input is-danger' : 'input'}
              onChange={e => handleSearch(e.target.value)}
            />
          </div>

          {errorText && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorText}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={searchQuery.length === 0}
              data-cy="searchButton"
              type="submit"
              onClick={e => {
                e.preventDefault();
                searchMovie(searchQuery);
              }}
              className={`button is-light ${isSearching ? 'is-loading' : ''}`}
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
                onClick={handleAdd}
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
