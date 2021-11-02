import React, { useState } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';

type Props = {
  addToApp: (user: Movie) => void
};

export const FindMovie: React.FC<Props> = ({ addToApp }) => {
  const [message, setMessage] = useState('');
  const [failedtoLoad, setLoadIssues] = useState(false);
  const [movie, loadMovie] = useState({
    Poster: '',
    Title: '',
    Plot: '',
    imdbID: '',
  });

  const searchText = (input:string) => {
    loadMovie({
      Poster: '',
      Title: '',
      Plot: '',
      imdbID: '',
    });
    setLoadIssues(false);
    setMessage(input);
  };

  const sendRequest = (name: string) => {
    fetch(`https://www.omdbapi.com/?apikey=e45c8c40&t=${name}`)
      .then(response => response.json())
      .then(result => {
        if (result.Error) {
          setLoadIssues(true);
        } else {
          loadMovie({
            Poster: result.Poster,
            Title: result.Title,
            Plot: result.Plot,
            imdbID: result.imdbID,
          });
        }
      });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          sendRequest(message);
          const target = event.target as HTMLFormElement;

          target.reset();
        }}
      >
        <div className="field">
          <label
            className="label"
            htmlFor="movie-title"
          >
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={'input'.concat(failedtoLoad ? ' is-danger' : '')}
                onChange={(event) => searchText(event.target.value.toString().trim())}
              />
            </div>
          </label>
          {failedtoLoad
            && (
              <p
                className="help is-danger"
              >
                Can&apos;t find a movie with such a title
              </p>
            )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => sendRequest(message)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              onClick={() => addToApp(movie)}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie.imdbID
          ? <MovieCard movie={movie} />
          : ''}
      </div>
    </>
  );
};
