import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { API_URL } from '../../api/movies';
import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [poster, newPoster] = useState('');
  const [title, newTitle] = useState('');
  const [plot, newPlot] = useState('');
  const [imdbId, newImdbId] = useState('');
  const [search, newSeach] = useState('');
  const [invaildData, newData] = useState(false);

  const movie = {
    Poster: poster,
    Title: title,
    Plot: plot,
    imdbID: imdbId,
  };

  const getMovie = async () => {
    const response = fetch(API_URL + search);
    const film: Promise<MovieSearch> = (await response).json();

    if ((await film).Response !== 'False') {
      newTitle((await (await film).Title));
      newPoster((await film).Poster);
      newPlot((await film).Plot);
      newImdbId((await film).imdbID);
    } else {
      newData(true);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    newSeach(event.target.value);
    newData(false);
  };

  const handleClick = () => {
    getMovie();
  };

  const handleSubmit = (event:React.FormEvent) => {
    event.preventDefault();
    onAdd(movie);
    newSeach('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              className={classNames(
                'input',
                {
                  'is-danger': invaildData === true,
                },
              )}
              value={search}
              onChange={handleChange}
            />
          </div>

          {invaildData && (
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
              onClick={handleClick}
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

      <div className="container">
        <h2 className="title">Preview</h2>
        {imdbId !== '' && <MovieCard movie={movie} /> }
      </div>
    </>
  );
};
