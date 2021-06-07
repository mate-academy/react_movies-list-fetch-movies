import React from 'react';
import './CurrentUser.scss';
import PropTypes from 'prop-types';
import { getUser } from '../../api';

export class CurrentUser extends React.Component {
  state = {
    user: null,
  }

  async componentDidMount() {
    const user = await getUser(this.props.userId);

    this.setState({ user });
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.userId !== this.props.userId) {
      const user = await getUser(this.props.userId);

      this.setState({ user });
    }
  }

  render() {
    const { userId } = this.props;
    const { user } = this.state;

    return (
      <div className="CurrentUser">
        {user && (
          <>
            <h2 className="CurrentUser__title">
              <span>
                Selected user:
                {userId}
              </span>
            </h2>
            <h3 className="CurrentUser__name">{user.name}</h3>
            <p className="CurrentUser__email">{user.email}</p>
            <p className="CurrentUser__phone">{user.phone}</p>
            <button
              type="button"
              onClick={() => this.setState({ user: null })}
            >
              Clear
            </button>
          </>
        )}
      </div>
    );
  }
}

CurrentUser.propTypes = {
  userId: PropTypes.number.isRequired,
}