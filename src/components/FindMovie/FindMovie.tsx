import React, { useState } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';

export type FindMovieProps = {
  addMovie: (movie: Movie) => void
};

export const FindMovie: React.FC <FindMovieProps> = ({ addMovie }) => {
  const [query, setQuery] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [numberOfSearch, setNumberOfSearch] = useState<number>(0);
  const [loding, setLoding] = useState<boolean>(false);

  const search = async (event: React.FormEvent) => {
    event.preventDefault();
    setNumberOfSearch((prev) => prev + 1);

    if (query.trim().length >= 1) {
      setLoding(true);
      const tmp = await getMovie(query);

      if ('Response' in tmp && tmp.Response === 'False') {
        setMovie(null);
        setError(true);
      } else {
        const tmp2 = tmp as MovieData;

        setMovie({
          title: tmp2.Title,
          description: tmp2.Plot,
          imgUrl: tmp2.Poster !== 'N/A' ? tmp2.Poster
            : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${tmp2.imdbID}`,
          imdbId: tmp2.imdbID,
        });
        setError(false);
      }
    }

    setLoding(false);
  };

  const addToList = () => {
    if (movie) {
      addMovie(movie);
      setMovie(null);
      setQuery('');
    }
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
              className={`input ${error ? 'is-danger' : ''}`}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value); setError(false);
              }}
            />
          </div>

          {error && (
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
              className={loding ? 'button is-loading' : 'button is-light'}
              disabled={query.length === 0}
              onClick={search}
            >
              {numberOfSearch === 0 ? ('Find a movie') : ('Search again') }
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addToList}
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
