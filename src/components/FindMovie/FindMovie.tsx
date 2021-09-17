import React, { useState } from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

type Props = {
  addMovie: (movie: Movie) => void;
  listOfMovie: Movie[];
};
export const FindMovie: React.FC<Props> = (props) => {
  const { addMovie, listOfMovie } = props;
  const [findedMovie, setMovie] = useState(null as Movie | null);
  const [query, setQuery] = useState('');
  const [isFoundMovie, setIsFound] = useState(true);

  const loadMovie = async () => {
    const movieData = await getMovie(query);

    if (movieData.Response === 'False') {
      setMovie(null);
      setIsFound(false);

      return;
    }

    setIsFound(true);
    setMovie({
      title: movieData.Title,
      description: movieData.Plot,
      imgUrl: movieData.Poster,
      imdbId: movieData.imdbID,
      imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
    });
    setQuery('');
  };

  const handleSearchForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
    setIsFound(true);
  };

  const handleAddMovie = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (findedMovie && !listOfMovie.find(item => item.imdbId === findedMovie.imdbId)) {
      addMovie(findedMovie as Movie);
    }

    setMovie(null);
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
              className="input is-danger"
              value={query}
              onChange={handleSearchForm}
            />
          </div>
          {!isFoundMovie && (
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
              onClick={loadMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleAddMovie}
              disabled={findedMovie == null && true}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {findedMovie && <MovieCard {...findedMovie} />}
      </div>
    </>
  );
};
