import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import cn from 'classnames';

interface Props {
  handleMovie: (newMovie: Movie) => void;
}

const titlesButton = ['Find a movie', 'Search again']

export const FindMovie: React.FC<Props> = ({ handleMovie }) => {

const [movie, setMovie] = useState<Movie | null>(null);
const [title, setTitle] = useState('');
const [isError, setError] = useState(false);
const [loaderStatus, setLoaderStatus] = useState(false);
const [valueButton, setValueButton] = useState(titlesButton[0]);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoaderStatus(true);

  try {
    const response = await getMovie(title);

    if ('Response' in response && response.Response === 'False') {
      setMovie(null);
      setError(true);
    } else {
      const movieData = response as MovieData;
      const imdbHTTPS = 'https://www.imdb.com/title/';
      const defaultPoster =
        'https://via.placeholder.com/360x270.png?text=no%20preview';

      const newMovie = {
        title: movieData.Title,
        description: movieData.Plot,
        imgUrl: movieData.Poster !== 'N/A' ? movieData.Poster : defaultPoster,
        imdbUrl: imdbHTTPS + movieData.imdbID,
        imdbId: movieData.imdbID,
      } as Movie;

      setMovie(newMovie);
      setError(false);
    }
  } catch (error) {
    setMovie(null);
  } finally {
    setLoaderStatus(false);
    setValueButton(titlesButton[1]);
  }
};

const handleAddToList = (newMovie: Movie) => {
  handleMovie(newMovie);
  setValueButton(titlesButton[0]);
  setMovie(null);
  setTitle('');
};

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
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
              className={cn("input", {"is-danger": isError} )}
              onChange={e => {
                setTitle(e.target.value);
                setError(false);
              }}
            />
          </div>
          {isError && (
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
              className={cn("button is-light", {"is-loading": loaderStatus})}
              disabled={!title}
            >
              {valueButton}
            </button>
          </div>

          {!isError && movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddToList(movie)}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        <MovieCard movie={movie} />
      </div>
      )}
      
    </>
  );
};
