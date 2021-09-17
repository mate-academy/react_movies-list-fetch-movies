import { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

import data from './api/movies.json';

interface State {
  movies: Movie[];
}

export class App extends Component<{}, State> {
  state: State = {
    movies: data,
  };

  addMovie = (newMovie: Movie) => {
    const { movies } = this.state;

    const isMovieFound = movies.find(movie => movie.imdbId === newMovie.imdbId);

    if (!isMovieFound) {
      this.setState(state => ({
        movies: [...state.movies, newMovie],
      }));
    }
  };

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie
            addMovie={this.addMovie}
          />
        </div>
      </div>
    );
  }
}
