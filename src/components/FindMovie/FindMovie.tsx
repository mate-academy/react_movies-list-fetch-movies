import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import classNames from 'classnames';

type Props = {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies}) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<MovieData | null>(null);

  const handleFindMovie = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
    setError('');
    setPreview(null);
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(title)
      .then(response => {
        if ('Error' in response) {
          setError(response.Error)
          setPreview(null);
        } else {
          setPreview(response);
        }
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  const moviePoster = 'https://via.placeholder.com/360x270.png?text=no%20preview';

  const addMovie = () => {
    if (!preview) {
      return;
    }

    const mappedMovie: Movie = {
      title: preview.Title,
      description: preview.Plot,
      imgUrl: preview.Poster === "N/A" ? moviePoster : preview.Poster,
      imdbUrl: `https://www.imdb.com/title/${preview.imdbID}`,
      imdbId: preview.imdbID,
    }

    const dublicate = movies.some(movie => movie.imdbId === mappedMovie.imdbId);

    if (dublicate) {
      setTitle("");
      setPreview(null);
      return;
    }

    setMovies(prevMovies => [...prevMovies, mappedMovie])
    setPreview(null);
  }


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
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
              onChange={handleFindMovie}
              value={title}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
             Can&apos;t find a movie with such a title
            </p>
          )}

        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames("button is-light", {"is-loading": isLoading})}
              disabled={!title}
            >
              Find a movie
            </button>
          </div>

          {preview && (
            <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
              onClick={addMovie}
            >
              Add to the list
            </button>
          </div>
          )}
        </div>
      </form>


        {preview && (
          <div className="container" data-cy="previewContainer">
            <h2 className="title">Preview</h2>
            <MovieCard movie={{
              title: preview.Title,
              description: preview.Plot,
              imgUrl: preview.Poster === "N/A" ? moviePoster : preview.Poster,
              imdbUrl: `https://www.imdb.com/title/${preview.imdbID}`,
              imdbId: preview.imdbID,
            }} />
          </div>
        )}
    </>
  );
};
