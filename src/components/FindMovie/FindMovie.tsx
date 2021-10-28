import React, { useState } from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

export const FindMovie: React.FC<{ addToList:(movie: Movie) => void }> = ({ addToList }) => {
  const initialAPILink = 'https://www.omdbapi.com/?apikey=17c1e864';
  const [movie, setMovie] = useState<Movie | null>(null);
  const [inputError, setInputError] = useState(false);
  const [input, setInput] = useState('');
  const findMovie = async (title:string) => {
    return fetch(`${initialAPILink}&t=[${title}]`).then(response => {
      if (!response.ok) {
        setInputError(true);

        return null;
      }

      return response.json();
    }).then((movie1:Movie) => {
      if (!movie1.Title) {
        setInputError(true);
        setMovie(null);

        return;
      }

      setMovie(movie);
    });
  };

  const addList = () => {
    if (movie) {
      addToList(movie);
      setInput('');
    }
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          {/* eslint-disable-next-line */}
          <label
            id="find-movie--label"
            className="label"
            htmlFor="movie-title"
          >
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              value={input}
              placeholder="Enter a title to search"
              className={`input ${inputError && 'is-danger'}`}
              onChange={event => {
                setInput(event.currentTarget.value);
                setInputError(false);
              }}
            />
          </div>

          {inputError && (
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
              onClick={() => findMovie(input)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addList}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      { movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie as Movie} />
        </div>
      )}
    </>
  );
};
