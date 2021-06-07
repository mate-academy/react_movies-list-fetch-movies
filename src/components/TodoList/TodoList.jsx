import React from 'react';
import './TodoList.scss';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { getTodos } from '../../api';

export class TodoList extends React.Component {
  state = {
    title: '',
    visibleTodos: [],
    status: 0,
  }

  async componentDidMount() {
    const todos = await getTodos();

    this.setState({
      visibleTodos: [...todos].slice(0, 10),
    });
  }

  render() {
    const { selectUser } = this.props;
    let { visibleTodos } = this.state;
    const { status, title } = this.state;

    if (status !== 0) {
      visibleTodos = (status === 1)
        ? visibleTodos.filter(el => el.completed)
        : visibleTodos.filter(el => !el.completed);
    }

    if (title.length !== 0) {
      visibleTodos = visibleTodos
        .filter(todo => todo.title
          .toLowerCase()
          .includes(title.toLowerCase()));
    }

    return (
      <div className="TodoList">

        <h2>Todos:</h2>
        <input
          type="text"
          value={this.state.title}
          onChange={event => this.setState({ title: event.target.value })}
        />

        <select
          value={status}
          onChange={event => this.setState({ status: +event.target.value })}
        >
          <option value={0}>
            Show All
          </option>
          <option value={1}>
            Show Completed
          </option>
          <option value={2}>
            Show Not completed
          </option>
        </select>

        <div className="TodoList__list-container">
          <ul className="TodoList__list">
            {visibleTodos.map(todo => (
              <li
                key={todo.id}
                className={classnames('TodoList__item',
                  todo.completed
                    ? 'TodoList__item--checked'
                    : 'TodoList__item--unchecked')}
              >
                <label>
                  <input
                    type="checkbox"
                    readOnly
                    checked={todo.completed}
                  />
                  <p>
                    {todo.title}
                  </p>
                </label>

                <button
                  className={classnames(
                    'TodoList__user-button',
                    'button',
                    todo.completed
                      ? 'TodoList__user-button--selected'
                      : '',
                  )}
                  type="button"
                  onClick={() => {
                    selectUser(todo.userId);
                  }}
                >
                  User #
                  {todo.userId}
                </button>
              </li>
            ))}

          </ul>
        </div>
      </div>
    );
  }
}

TodoList.propTypes = {
  selectUser: PropTypes.func.isRequired,
};
