/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface Props {
  value: string;
  movies: Movie[];
  setValue: (value: string) => void;
  setMovies: (movies: Movie[]) => void;
}

export const FindMovie: React.FC<Props> = ({
  value,
  movies,
  setValue,
  setMovies,
}) => {
  const [movieData, setMovieData] = useState<MovieData | ResponseError>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [danger, setDanger] = useState<boolean>(false);
  const [addButton, setAddButton] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function isMovieData(_movieData: any): _movieData is MovieData {
    if (
      'Poster' in { ..._movieData } &&
      'Title' in { ..._movieData } &&
      'Plot' in { ..._movieData } &&
      'imdbID' in { ..._movieData }
    ) {
      return true;
    }

    setDanger(true);

    return false;
  }

  function findMovie(query: string) {
    setIsLoading(true);

    getMovie(query)
      .then(res => {
        if (isMovieData(res)) {
          const { Title, Plot, imdbID } = res;
          const defaultPicture =
            'https://via.placeholder.com/360x270.png?text=no%20preview';
          const Poster = res.Poster === 'N/A' ? defaultPicture : res.Poster;

          setMovieData({ Poster, Title, Plot, imdbID });
        }
      })
      .finally(() => setIsLoading(false));
  }

  function addMovie(_movie: Movie | null) {
    const isExists = movies.some(__movie => __movie.imdbId === _movie?.imdbId);

    if (_movie && !isExists) {
      setMovies([...movies, _movie]);
    }

    setValue('');
    setAddButton(false);
    setMovieData(undefined);
    setMovie(null);
  }

  useEffect(() => {
    if (movieData && isMovieData(movieData)) {
      const { Poster, Title, Plot, imdbID } = movieData;
      const normalizedMovieData: Movie = {
        title: Title,
        description: Plot,
        imgUrl: Poster,
        imdbUrl: `https://www.imdb.com/title/${imdbID}`,
        imdbId: imdbID,
      };

      setAddButton(true);
      setMovie(normalizedMovieData);
    }
  }, [movieData]);

  return (
    <>
      <form className="find-movie" onSubmit={event => event.preventDefault()}>
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
              value={value}
              onChange={event => {
                setValue(event.target.value);

                if (danger === true) {
                  setDanger(false);
                }
              }}
              className={`input ${danger && 'is-danger'}`}
            />
          </div>

          {danger && (
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
              className={`button is-light ${isLoading && 'is-loading'}`}
              disabled={value.length > 0 ? false : true}
              onClick={() => findMovie(value)}
            >
              Find a movie
            </button>
          </div>

          {addButton && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => addMovie(movie)}
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
