import React, { useState } from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { loadMovie } from '../../api/api';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = (props) => {
  const { onAdd } = props;
  const [newMovie, setNewMovie] = useState(null as Movie | null);
  const [query, setValue] = useState('');
  const [find, setFind] = useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFind(true);
    setValue(event.target.value);
  };

  const getMovie = async () => {
    const data = await loadMovie(query);

    if (data.Response === 'False') {
      setNewMovie(null);
      setFind(false);

      return;
    }

    setFind(true);

    setNewMovie({
      title: data.Title,
      description: data.Plot,
      imgUrl: data.Poster,
      imdbId: data.imdbID,
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    });

    setValue('');
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
              className={find ? 'input' : 'input is-danger'}
              value={query}
              onChange={handleChange}
              required
            />
          </div>

          {
            (find) || (
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
              className="button is-light"
              onClick={() => {
                getMovie();
              }}
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
                if (newMovie !== null) {
                  onAdd(newMovie);
                }

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
        {
          newMovie && <MovieCard {...newMovie} />
        }
      </div>
    </>
  );
};
