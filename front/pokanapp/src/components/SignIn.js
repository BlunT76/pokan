import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setUserData, setShowAlertStatus, setShow } from '../store/Actions';
import apiSignIn from '../api/apiSignIn';

const mapStateToProps = (state) => {
  const { isLogged } = state;
  return { isLogged };
};

class SignIn extends PureComponent {
  constructor(props) {
    super(props);
    this.checkLogin = this.checkLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      username: '',
      password: '',
    };
  }

  checkLogin = async (event) => {
    const { username, password } = this.state;
    const { dispatch } = this.props;
    event.preventDefault();
    const response = apiSignIn(username, password);
    const responseJSON = await response;

    if (responseJSON.data.code === 200) {
      const { jwt, userid } = responseJSON.data;
      dispatch(setUserData({ jwt, userid, isLogged: true }));
      dispatch(setShowAlertStatus({
        title: responseJSON.data.status,
        text: responseJSON.data.message,
        show: true,
        variant: 'success',
      }));
      dispatch(setShow('kanban'));
    }

    if (responseJSON.data.code === 404) {
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
    const { username, password } = this.state;
    return (
      <Form onSubmit={this.checkLogin} className="col-4 border shadow-lg mx-auto m-5 p-2 list">
        <h1 className="h1 text-center text-danger">Sign In</h1>
        <Form.Group controlId="formBasicEmail">
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

        <Form.Group controlId="formBasicPassword">
          <Form.Label className="text-danger">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            autoComplete="password"
            name="password"
            value={password}
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

SignIn.propTypes = {
  dispatch: PropTypes.func,
};

SignIn.defaultProps = {
  dispatch: () => {},
};

export default connect(mapStateToProps)(SignIn);
