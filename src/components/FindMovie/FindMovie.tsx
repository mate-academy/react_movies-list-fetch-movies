import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
// import movies from '../../api/movies.json';

type Props = {
  onFindMovie: (value: string) => Promise<FromServer>;
  setMovies: (movie: Movie) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = (props) => {
  const {
    onFindMovie,
    setMovies,
    movies,
  } = props;

  const [value, setTitleInputValue] = useState('');
  const [findedMovie, setFindMovie] = useState<Movie | null>(null);
  const [isValidTitleField, setValidTitleField] = useState(true);

  const handleEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValidTitleField(true);

    return (
      setTitleInputValue(event.target.value)
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const movieExistInList = movies.find(movie => {
      if (findedMovie) {
        return movie.imdbId === findedMovie.imdbId;
      }

      return setValidTitleField(false);
    });

    if (!movieExistInList && findedMovie) {
      setMovies(findedMovie);
    }
  };

  const handleFindMovie = () => {
    return onFindMovie(value)
      .then(moviesFromServer => {
        return setFindMovie(() => {
          if (moviesFromServer.Response === 'True') {
            setValidTitleField(true);
            setTitleInputValue('');

            return ({
              title: moviesFromServer.Title,
              description: moviesFromServer.Plot,
              imgUrl: moviesFromServer.Poster,
              imdbUrl: `https://www.imdb.com/title/${moviesFromServer.imdbID}`,
              imdbId: moviesFromServer.imdbID,
            });
          }

          setValidTitleField(false);
          setTitleInputValue('');

          return null;
        });
      });
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
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={
                classNames(
                  'input',
                  {
                    'is-danger': !isValidTitleField,
                  },
                )
              }
              value={value}
              onChange={handleEvent}
            />
          </div>
          {
            !isValidTitleField
            && (
              <p className="help is-danger">
                Can&apos;t find a movie with such a title
              </p>
            )
          }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleFindMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-link"
              disabled={!findedMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {findedMovie !== null && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard {...findedMovie} />
          </>
        )}
      </div>
    </>
  );
};
