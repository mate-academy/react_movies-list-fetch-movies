import React, { useState, Dispatch, SetStateAction } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';

type Props = {
  searchTitle: string;
  setSearchTitle: (val: string) => void;
  movies: Movie[];
  setMovies: Dispatch<SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({
  searchTitle,
  setSearchTitle,
  movies,
  setMovies,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [preview, setPreview] = useState<MovieData | ResponseError | null>(
    null,
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    setSearchTitle(event.target.value);
  };

  const disable = searchTitle.length < 1;

  const unitForHandlers = () => {
    setIsLoading(true);

    getMovie(searchTitle)
      .then(response => {
        if ('Error' in response) {
          setErrorMessage("Can't find a movie with such a title");
          setPreview(null);
        } else {
          setPreview(response);
        }
      })
      .catch(() => setErrorMessage("Can't find a movie with such a title"))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    unitForHandlers();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      unitForHandlers();
    }
  };

  const addMovie = (movie: Movie) => {
    const exists = movies.find(m => m.imdbId === movie.imdbId);

    if (!exists) {
      setMovies(prevMovies => [...prevMovies, movie]);
      setSearchTitle('');
      setPreview(null);
    } else {
      setSearchTitle('');
      setPreview(null);
    }
  };

  function getMovieFromData(movieData: MovieData): Movie {
    const poster =
      movieData.Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : movieData.Poster;

    return {
      title: movieData.Title,
      description: movieData.Plot,
      imgUrl: poster,
      imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
      imdbId: movieData.imdbID,
    };
  }

  const handleAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    addMovie(getMovieFromData(preview as MovieData));
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
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              value={searchTitle}
              onChange={handleSearchChange}
              className={cn('input')} //, {"is-danger": danger}
              onKeyDown={handleKeyDown}
            />
          </div>

          {errorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn('button is-light', { 'is-loading': isLoading })}
              disabled={disable}
              onClick={handleSubmit}
            >
              {!preview ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {preview && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAdd}
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
          {<MovieCard movie={getMovieFromData(preview as MovieData)} />}
        </div>
      )}
    </>
  );
};
