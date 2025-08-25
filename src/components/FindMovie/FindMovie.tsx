import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ResponseError';
import { MovieCard } from '../MovieCard';

type FindMovieProps = {
  movies: Movie[];
  onAddMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<FindMovieProps> = ({
  onAddMovies,
  movies,
}) => {
  const [query, setQuery] = useState('');
  const [movieData, setMovieData] = useState<Movie | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setQuery(e.target.value);
  };

  const handleMovieSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    getMovie(query)
      .then((data: ResponseError | MovieData) => {
        if ('Error' in data) {
          setError("Can't find a movie with such a title");
          setMovieData(undefined);

          return;
        }

        const { Poster, Title, Plot, imdbID } = data;

        setMovieData({
          title: Title,
          description: Plot,
          imdbId: imdbID,
          imgUrl:
            Poster && Poster !== 'N/A' && Poster.trim() !== ''
              ? Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: 'https://www.imdb.com/title/' + imdbID,
        });
        setError('');
      })
      .finally(() => setLoading(false));
  };

  const handleAddMovie = () => {
    if (movieData && !movies.some(m => m.imdbId === movieData.imdbId)) {
      onAddMovies(prev => [...prev, movieData]);
      setMovieData(undefined);
      setQuery('');
    } else {
      setMovieData(undefined);
      setQuery('');
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleMovieSearch}>
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
              className={`input ${error ? 'is-danger' : ''}`}
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              {error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={`button ${loading ? 'is-loading' : 'is-light'}`}
              disabled={!query.trim()}
            >
              Find a movie
            </button>
          </div>

          {movieData && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movieData && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movieData} />
        </div>
      )}
    </>
  );
};
