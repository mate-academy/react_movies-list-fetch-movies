import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [querySearch, setQuerySearch] = useState('');
  const [movie, setMovie] = useState<Movie>();
  const [error, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleClick
    = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      setLoading(true);
      const result = await getMovie(querySearch);

      setLoading(false);

      if ('Title' in result) {
        const {
          Title, Plot, Poster, imdbID,
        } = result;

        setMovie({
          title: Title,
          description: Plot,
          imgUrl:
            (Poster !== 'N/A'
              ? Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview'),
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        });
        setError(false);
      } else {
        setError(true);
        setMovie(undefined);
      }
    };

  const addToTheList = () => {
    if (movie) {
      addMovie(movie);
      setQuerySearch('');
      setMovie(undefined);
    }
  };

  const handleInput = (value: string) => {
    setQuerySearch(value);
    setError(false);
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
              className="input is-dander"
              value={querySearch}
              onChange={(e) => {
                handleInput(e.target.value);
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
              className={`button is-light ${isLoading && 'is-loading'}`}
              disabled={!querySearch}
              onClick={(e) => {
                handleClick(e);
              }}
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
                onClick={() => {
                  addToTheList();
                }}
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
