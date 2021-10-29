import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  onAddMovie: (movieToAdd: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [Query, setQuery] = useState('');
  const [Movie, setMovie] = useState<Movie | null>(null);
  const [Error, setError] = useState(false);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (Movie) {
      onAddMovie(Movie);
    }

    setMovie(null);
    setQuery('');
  };

  const findMovie = async () => {
    const movie = await getMovie(Query);

    if (movie.Response === 'True') {
      setMovie({
        Title: movie.Title,
        Poster: movie.Poster,
        Plot: movie.Plot,
        imdbID: movie.imdbID,
        Response: movie.Response,
      });
    } else {
      setError(true);
    }
  };

  // const HandleAdd = () => {
  //   if (Movie !== null) {
  //     onAddMovie(Movie),
  //     setQuery(''),
  //     setError(false),
  //     setMovie(null);
  //   }
  // };

  return (
    <>
      <form className="find-movie" onSubmit={handleFormSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title

            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames('input', { 'is-danger': Error })}
                onChange={event => {
                  setQuery(event.target.value);
                  setError(false);
                }}
              />
            </div>
          </label>

          {Error && (
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
              onClick={() => {
                if (Movie){
                  onAddMovie(Movie)
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {Movie && <MovieCard movie={Movie} />}
      </div>
    </>
  );
};
