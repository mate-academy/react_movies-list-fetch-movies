import { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

interface State {
  movies: Movie[];
  message: string,
}

export class App extends Component<{}, State> {
  state: State = {
    movies: [],
    message: '',
  };

  addMovieToList = (newMovie: Movie) => {
    const index = this.state.movies.findIndex(movie => movie.Title === newMovie.Title);

    if (index < 0) {
      this.setState(state => ({
        movies: [newMovie, ...state.movies],
        message: '',
      }));
    } else {
      this.setState({
        message: 'This movie was add earlier',
      });
    }
  };

  correctMessage = (newMessage: string) => {
    this.setState({
      message: newMessage,
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
          <FindMovie
            addMovieToList={this.addMovieToList}
            message={this.state.message}
            correctMessage={this.correctMessage}
          />
        </div>
      </div>
    );
  }
}
