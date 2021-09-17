import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { request } from '../../api/api';

interface Props {
  onAdd: (movie: Movie | null) => void;
}

export const FindMovie: React.FC<Props> = (props) => {
  const { onAdd } = props;
  const [newMovie, setNewMovie] = useState(null as Movie | null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFound, setIsFound] = useState(true);

  const getMovieFromServer = async () => {
    const data = await request(searchQuery);

    if (data.Response === 'False') {
      setIsFound(false);
      setNewMovie(null);

      return;
    }

    setIsFound(true);
    setNewMovie({
      title: data.Title,
      description: data.Plot,
      imgUrl: data.Poster,
      imdbId: data.imdbID,
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    });
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
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': !isFound })}
              value={searchQuery}
              onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                setSearchQuery(target.value);
                setIsFound(true);
              }}
            />
          </div>

          {!isFound
            && (
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
              onClick={getMovieFromServer}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={!newMovie}
              onClick={() => {
                onAdd(newMovie);
                setNewMovie(null);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {newMovie && (
          <MovieCard {...newMovie} key={newMovie.imdbId} />
        )}
      </div>
    </>
  );
};
