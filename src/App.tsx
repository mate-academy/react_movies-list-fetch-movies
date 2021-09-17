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

  onUpdateMovies = (selectedMovie: Movie) => {
    this.setState(state => ({
      movies: [...state.movies, selectedMovie],
    }) as Pick<State, keyof State>);
  };

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie movies={movies} onUpdateMovies={this.onUpdateMovies} />
        </div>
      </div>
    );
  }
}
