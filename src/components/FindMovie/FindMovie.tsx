import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api/movies';

import { MovieCard } from '../MovieCard';

type Props = {
  toAddMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ toAddMovie }) => {
  const [query, toQueryState] = useState('');
  const [findMovie, toFindMovieState] = useState<Movie | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [showError, setShowErrorState] = useState(false);
  const [addToList, setAddToList] = useState(false);

  // control query......................................................
  const changeQueryHandler = (inputValue: string) => {
    setShowErrorState(false);
    toQueryState(inputValue);
  };

  // async download movie...............................................
  const downloadMovie = async () => {
    if (query.length > 0) {
      setStatusLoading(true);

      try {
        // eslint-disable-next-line no-console
        console.log('try to start download');
        const newMovie = await getMovie(query);

        setStatusLoading(false);

        // eslint-disable-next-line no-console
        console.log('newMovie', newMovie);

        // eslint-disable-next-line no-console
        console.log('add new movie to state', newMovie.Title);
        toFindMovieState(newMovie);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('catch error');
        setShowErrorState(true);
        setStatusLoading(false);
      }
    }
  };

  const addToListHandler = (value: boolean) => {
    setAddToList(value);

    // eslint-disable-next-line no-console
    console.log(addToList);

    if (findMovie) {
      toAddMovie(findMovie);
      toFindMovieState({
        Poster: '',
        Title: '',
        Plot: '',
        imdbID: '',
      });

      setAddToList(false);
    }
  };

  const submitForm = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    downloadMovie();

    // eslint-disable-next-line no-console
    console.log('movie = ');

    // eslint-disable-next-line no-console
    console.log('addToListApp?', addToList);

    // don't work: i try to receive addToList as permissionn
  };

  return (
    <>
      {statusLoading && (<p>Loading...</p>)}
      {showError && (<p>error</p>)}
      <form
        className="find-movie"
        onSubmit={submitForm}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                name="title"
                value={query}
                onChange={event => changeQueryHandler(event.target.value)}
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className="input is-danger"
              />
            </div>
          </label>
          <p className="help is-danger">
            Can&apos;t find a movie with such a title
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => addToListHandler(true)}
              disabled={!findMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {findMovie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={findMovie} />
          </>
        )}
      </div>
    </>
  );
};
