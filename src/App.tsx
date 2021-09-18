import { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { getMovie } from './api/api';
import data from './api/movies.json';

interface State {
  movies: Movie[];
}

export class App extends Component<{}, State> {
  state: State = {
    movies: data,
  };

  setMovies = (movie: Movie) => {
    this.setState((currentState) => {
      return ({
        movies: [...currentState.movies, movie],
      });
    });
  };

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie onFindMovie={getMovie} setMovies={this.setMovies} movies={movies} />
        </div>
      </div>
    );
  }
}
