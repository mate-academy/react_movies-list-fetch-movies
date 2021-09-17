import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getFilm } from '../../api/api';
import data from '../../api/movies.json';

interface Props {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = (props) => {
  const { addMovie } = props;
  const [title, setTitle] = useState('');
  const [newFilm, setNewFilm] = useState(null as Movie | null);
  const [isValid, setValid] = useState(true);
  const [isHasFilm, setIsHasFilm] = useState(false);

  const searchMovie = async () => {
    const searchFilm = await getFilm(title);

    if (searchFilm.Response === 'False') {
      setNewFilm(null);
      setValid(false);
    } else {
      setValid(true);
      setNewFilm({
        title: searchFilm.Title,
        description: searchFilm.Plot,
        imgUrl: searchFilm.Poster,
        imdbUrl: `https://www.imdb.com/title/${searchFilm.imdbID}/`,
        imdbId: searchFilm.imdbID,
      });
      setTitle('');
    }

    // eslint-disable-next-line no-console
    console.log(searchFilm);

    if (data.find(movie => movie.imdbId === searchFilm.imdbID)) {
      setIsHasFilm(true);
    } else {
      setIsHasFilm(false);
    }
  };

  const handleChange = () => {
    if (newFilm) {
      addMovie(newFilm);
      setNewFilm(null);
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
                  'is-danger': !isValid,
                },
              )}
              value={title}
              onChange={event => (
                setTitle(event.target.value)
              )}
            />
          </div>
          {isValid || (
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
              onClick={searchMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={!newFilm || isHasFilm}
              onClick={handleChange}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      <div className="container">
        <h2 className="title">Preview</h2>
        {isHasFilm && (
          <span className="error">This film already added choose another</span>
        )}
        {newFilm && (
          <MovieCard {...newFilm} />
        )}
      </div>
    </>
  );
};
