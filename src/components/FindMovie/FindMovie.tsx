/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { searchMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState({
    Poster: '',
    Title: '',
    Plot: '',
    imdbID: '',
  } as Movie);
  const [input, setInput] = useState('');
  const [movieExist, setMovieExist] = useState(true);
  const [card, setVisibleCard] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setInput(value);
    setMovieExist(true);
  };

  const handleSearch = async () => {
    try {
      const movieFromServer = await searchMovie(input);

      setMovie(movieFromServer);
      setMovieExist(true);
      setVisibleCard(true);
    } catch (error) {
      setMovieExist(false);
    }
  };

  const handleAdd = () => {
    if (card) {
      setInput('');
      addMovie(movie);
      setVisibleCard(false);
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
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames(
                'input',
                {
                  'is-danger': !movieExist,
                },
              )}
              name="title"
              value={input}
              onChange={handleChange}
            />
          </div>

          {!movieExist && (
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
              onClick={handleSearch}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleAdd}
              disabled={!card}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {card && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
