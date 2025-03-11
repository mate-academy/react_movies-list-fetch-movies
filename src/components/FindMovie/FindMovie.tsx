import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ResponseError';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [inputValue, setInputValue] = useState('');
  const [movieData, setMovieData] = useState<MovieData>();
  const [errorMassage, setErrorMessage] = useState<ResponseError | null>(null);
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e): void => {
    e.preventDefault();

    setLoading(true);
    getMovie(inputValue)
      .then((data: MovieData | ResponseError) => {
        if ('Error' in data) {
          setErrorMessage({
            Response: 'False',
            Error: 'Can&apos;t find a movie with such a title',
          });

          return;
        }

        const formattedMovie: MovieData = {
          Poster: data.Poster,
          Title: data.Title,
          Plot: data.Plot,
          imdbID: data.imdbID,
        };

        setMovieData(formattedMovie);

        setErrorMessage(null);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (movieData) {
      setMovie({
        title: movieData.Title,
        description: movieData.Plot,
        imgUrl:
          movieData.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : movieData.Poster,
        imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
        imdbId: movieData.imdbID,
      });
    }
  }, [movieData]);

  const handleAdd = () => {
    if (movie) {
      setMovie(null);
      setInputValue('');
      onAddMovie(movie);
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
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${errorMassage && 'is-danger'}`}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
            />
          </div>
          {errorMassage && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMassage.Error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={`button is-light ${loading && 'is-loading'}`}
              onClick={handleClick}
              disabled={inputValue.length === 0}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAdd}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        {movie && <h2 className="title">Preview</h2>}
        {movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
