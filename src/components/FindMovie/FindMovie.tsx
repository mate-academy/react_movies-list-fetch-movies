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
}

export const FindMovie: React.FC<Props> = ({
  searchTitle,
  setSearchTitle,
  movies,
  setMovies,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [preview, setPreview] = useState<MovieData | ResponseError | null>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('')
    setSearchTitle(event.target.value)
  };

  const disable = searchTitle.length < 1;

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setIsLoading(true);

    getMovie(searchTitle)
      .then((response) => {
        if ('Error' in response) {
          setErrorMessage("Can't find a movie with such a title");
          setPreview(null);
        } else {
          setPreview(response);
        }
      })
      .catch(() => setErrorMessage("Can't find a movie with such a title"))
      .finally(() => {
        setIsLoading(false)
      })
  };

  const addMovie = (movie: Movie) => {
    const exists = movies.find(m => m.imdbId === movie.imdbId);
    if (!exists) {
      setMovies(prevMovies => [...prevMovies, movie]);
    } else {
      setSearchTitle('');
      setPreview(null);
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit;
    }
  }

  const handleAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    addMovie(getMovieFromData(preview as MovieData));
  }

  function getMovieFromData(movieData: MovieData): Movie {
    return {
      title: movieData.Title,
      description: movieData.Plot,
      imgUrl: movieData.Poster,
      imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`, 
      imdbId: movieData.imdbID,
    }
  }

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
              className={cn("input")} //, {"is-danger": danger}
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
              className={cn ("button is-light", {"is-loading":isLoading}) }
              disabled={disable}
              onClick={handleSubmit}
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
        {<MovieCard movie={getMovieFromData(preview as MovieData)}/>}
      </div>
      )}
    </>
  );
};
