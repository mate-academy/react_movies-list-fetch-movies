import './FindMovie.scss';
import React, { FormEvent, useCallback, useState } from 'react';
import { MovieCard } from '../MovieCard';
import { getData } from '../../api';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [search, setSearch] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [searchError, setSearchError] = useState('');

  const Findmovie = useCallback(() => {
    if (!search.trim()) {
      setSearchError('Invalid Data!');
    } else {
      const findMovie = async () => {
        const respons = await getData(search);

        if (respons.Response === 'True') {
          setMovie(respons);
          setSearchError('');
        } else {
          setSearchError('Cant find movie');
        }
      };

      findMovie();
    }
  }, [search]);

  const Add = useCallback((event: FormEvent) => {
    event.preventDefault();

    if (!searchError && movie) {
      addMovie(movie);
      setMovie(null);
      setSearch('');
    }
  }, [movie, searchError]);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={Add}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="label"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
            />
          </div>
          {searchError && (
            <p className="help is-danger">
              {searchError}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={Findmovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard
            movie={movie}
          />
        </div>
      )}
    </>
  );
};
