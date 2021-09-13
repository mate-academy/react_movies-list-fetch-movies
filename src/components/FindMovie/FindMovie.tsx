import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { Film } from '../../types/Film';
import { MovieCard } from '../MovieCard';

type Props = {
  addFilm: (movie: Film) => void;
};

export const FindMovie: React.FC<Props> = ({ addFilm }) => {
  const [inputValue, setValue] = useState('');
  const [movie, setMovie] = useState<Film>({ Response: 'True' });

  const getDate = () => {
    fetch(`https://www.omdbapi.com/?apikey=ead1aa09&t=${inputValue}`)
      .then(res => res.json())
      .then(({
        Title,
        Plot,
        Poster,
        imdbID: imdbId,
        Response,
      }) => setMovie({
        title: Title,
        description: Plot,
        imgUrl: Poster,
        imdbUrl: `https://www.imdb.com/title/${imdbId}`,
        imdbId,
        Response,
      }));
  };

  const onChange = (e: { target: { value: string } }) => {
    setValue(e.target.value);
    setMovie({ ...movie, Response: 'True' });
  };

  const newFilm = () => (movie.title) && (addFilm(movie), setValue(''));

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
              value={inputValue}
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': movie?.Response !== 'True' })}
              onChange={onChange}
            />
          </div>

          {(movie?.Response !== 'True') && (
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
              onClick={getDate}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={newFilm}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie?.title && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...movie} />
        </div>
      )}
    </>
  );
};
