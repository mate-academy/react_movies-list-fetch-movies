import React, { FC, useState } from 'react';
import cx from 'classnames';
import { getData } from '../../api';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: (newMovie: Movie | null) => void;
}

export const FindMovie: FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [isFindMovie, setFindMovie] = useState(false);
  const [newMovie, setNewMovie] = useState<Movie | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
    setFindMovie(false);
    setNewMovie(null);
  };

  const findMovie = async () => {
    if (!query) {
      return;
    }

    try {
      const getMoviesFromApi = await getData<NewMovie>(`https://www.omdbapi.com/?apikey=a3ae9a4e&t=${query}`);

      if (getMoviesFromApi.Response === 'True') {
        setNewMovie({
          title: getMoviesFromApi.Title,
          description: getMoviesFromApi.Plot,
          imgUrl: getMoviesFromApi.Poster,
          imdbUrl: `https://www.imdb.com/title/${getMoviesFromApi.imdbID}`,
          imdbId: getMoviesFromApi.imdbID,
        });
        setQuery('');
      } else {
        setFindMovie(true);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error.message);
    }
  };

  const addMovieToList = () => {
    addMovie(newMovie);
    setQuery('');
    setNewMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={(event) => event.preventDefault()}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              value={query}
              placeholder="Enter a title to search"
              className={cx({ input: true, 'is-danger': isFindMovie })}
              onChange={handleChange}
            />
          </div>

          <p className={cx({ help: true, 'is-danger': isFindMovie, error: !isFindMovie })}>
            Can&apos;t find a movie with such a title
          </p>
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
              onClick={addMovieToList}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {newMovie && <MovieCard movie={newMovie} />}
      </div>
    </>
  );
};
