import React, { useState } from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = (props) => {
  const { onAdd } = props;
  const [movie, setMovie] = useState(null as Movie | null);
  const [query, setQuery] = useState('');
  const [isValid, setValid] = useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setValid(true);
  };

  const findMovie = async () => {
    const movieFromServer = await getMovie(query);

    if (movieFromServer.Response === 'False') {
      setValid(false);
      setMovie(null);

      return;
    }

    setMovie({
      title: movieFromServer.Title,
      description: movieFromServer.Plot,
      imgUrl: movieFromServer.Poster,
      imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}/`,
      imdbId: movieFromServer.imdbID,
    });

    setQuery('');
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
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={isValid ? 'input' : 'input is-danger'}
              value={query}
              onChange={handleChange}
            />
          </div>
          {!isValid && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={!movie}
              onClick={() => {
                onAdd(movie as Movie);
                setMovie(null);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && (
          <MovieCard {...movie} />
        )}
      </div>
    </>
  );
};
