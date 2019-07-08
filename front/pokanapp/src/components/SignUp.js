import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setShowAlertStatus } from '../store/Actions';
import apiSignUp from '../api/apiSignUp';

const mapStateToProps = (state) => {
  const { isLogged } = state;
  return { isLogged };
};


class SignUp extends PureComponent {
  constructor(props) {
    super(props);
    this.checkLogin = this.checkLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      username: '',
      email: '',
      password_1: '',
      password_2: '',
    };
  }

  checkLogin = async (event) => {
    const {
      // eslint-disable-next-line camelcase
      username, email, password_1, password_2,
    } = this.state;
    const { dispatch } = this.props;
    event.preventDefault();
    const response = apiSignUp(username, email, password_1, password_2);
    const responseJSON = await response;

    if (responseJSON.data.code === 200) {
      dispatch(setShowAlertStatus({
        title: responseJSON.data.status,
        text: responseJSON.data.message,
        show: true,
        variant: 'success',
      }));
    } else {
      dispatch(setShowAlertStatus({
        title: responseJSON.data.status,
        text: responseJSON.data.message,
        show: true,
        variant: 'danger',
      }));
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const {
      // eslint-disable-next-line camelcase
      username, email, password_1, password_2,
    } = this.state;
    return (
      <Form onSubmit={this.checkLogin} className="col-4 border shadow-lg mx-auto m-5 p-2 list">
        <h1 className="h1 text-center text-danger">SignUp</h1>
        <Form.Group>
          <Form.Label className="text-danger">Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            autoComplete="username"
            name="username"
            value={username}
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="text-danger">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            autoComplete="email"
            name="email"
            value={email}
            onChange={this.handleChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label className="text-danger">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            autoComplete="password"
            name="password_1"
            // eslint-disable-next-line camelcase
            value={password_1}
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="text-danger">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Validate Password"
            autoComplete="password"
            name="password_2"
            // eslint-disable-next-line camelcase
            value={password_2}
            onChange={this.handleChange}
          />
        </Form.Group>
        <Button variant="outline-danger" type="submit">
          Submit
        </Button>
      </Form>
    );
  }
}

SignUp.propTypes = {
  dispatch: PropTypes.func,
};

SignUp.defaultProps = {
  dispatch: () => {},
};

export default connect(mapStateToProps)(SignUp);
