import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import classNames from 'classnames';

type Props = {
  onAdd: (movies: Movie[]) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({ onAdd, movies }) => {
  const [formData, setFormData] = useState({
    query: '',
    loading: false,
    previewMovie: null as Movie | null,
    error: false,
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormData(prevState => ({ ...prevState, loading: true }));
    try {
      const data = await getMovie(formData.query);

      if ('Error' in data) {
        setFormData(prevState => ({ ...prevState, error: true }));

        return;
      }

      const { Title, Plot, Poster, imdbID } = data;

      setFormData({
        query: '',
        loading: false,
        error: false,
        previewMovie: {
          title: Title,
          description: Plot,
          imgUrl:
            Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : Poster,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        },
      });
    } catch (error) {
      setFormData(prevState => ({ ...prevState, loading: false }));
    }
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setFormData(prevState => ({ ...prevState, query: value, error: false }));
  };

  const addMovie = () => {
    const { previewMovie } = formData;

    if (
      !previewMovie ||
      movies.find(movie => movie.imdbId === previewMovie.imdbId)
    ) {
      return;
    }

    onAdd([...movies, previewMovie]);
    setFormData({ ...formData, previewMovie: null });
  };

  const { query, loading, previewMovie, error } = formData;

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
              className={classNames('input', { 'is-danger': error })}
              value={query}
              onChange={handleQueryChange}
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
              className={classNames('button', 'is-light', {
                'is-loading': loading,
              })}
              disabled={query.trim() === ''}
            >
              Find a movie
            </button>
          </div>
          {!loading && previewMovie && (
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
      {!loading && previewMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={previewMovie} />
        </div>
      )}
    </>
  );
};
