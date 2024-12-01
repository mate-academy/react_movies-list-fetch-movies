import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import classNames from 'classnames';

type Props = {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({ setMovies, movies }) => {
  const [query, setQuery] = useState('');
  const [foundMovie, setFoundMovie] = useState<Movie | undefined>();
  const [isSearched, setIsSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const findMovie = (searchQuery: string) => {
    setLoading(true);

    getMovie(searchQuery)
      .then(mov => {
        if (mov.Response === 'True') {
          setFoundMovie({
            title: mov.Title,
            description: mov.Plot,
            imgUrl:
              mov.Poster !== 'N/A'
                ? mov.Poster
                : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbId: mov.imdbID,
            imdbUrl: `https://www.imdb.com/title/${mov.imdbID}`,
          });
        }
      })
      .finally(() => {
        setIsSearched(true);
        setLoading(false);
      });
  };

  const submitMovie = () => {
    setIsSearched(false);

    if (foundMovie) {
      const isAlredyOnTheList = movies.find(
        movie => movie.imdbId === foundMovie.imdbId,
      )
        ? true
        : false;

      if (!isAlredyOnTheList) {
        setMovies(prev => [...prev, foundMovie]);
      }

      setFoundMovie(undefined);
      setQuery('');
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={event => event.preventDefault()}>
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
                'is-danger': isSearched && !foundMovie,
              })}
              value={query}
              onChange={event => {
                setQuery(event.target.value);
                setIsSearched(false);
              }}
            />
          </div>

          {isSearched && !foundMovie && (
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
              disabled={query.trim() === ''}
              onClick={() => findMovie(query)}
            >
              {isSearched ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {foundMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={submitMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {foundMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
