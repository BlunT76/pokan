import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { FaUserPlus, FaUserCheck, FaSignOutAlt } from 'react-icons/fa';
import { connect } from 'react-redux';
import {
  setShow, setUserData, setProjectsData, setListsData, resetTasksData, setSelectedProjectId,
} from '../store/Actions';
import AlertStatus from './AlertStatus';
import ProjectsModal from './ProjectsModal';

const mapStateToProps = (state) => {
  const { user, show, showAlertStatus } = state;
  return { user, show, showAlertStatus };
};

class AppBar extends PureComponent {
  showSignUpIn = (e) => {
    const { show, dispatch } = this.props;
    if (show !== e) {
      dispatch(setShow(e));
    } else {
      dispatch(setShow(''));
    }
  }


  showSignOut = () => {
    const { dispatch } = this.props;
    dispatch(setUserData({}));
    dispatch(setShow(''));
    dispatch(setProjectsData([]));
    dispatch(setListsData([]));
    dispatch(resetTasksData());
    dispatch(setSelectedProjectId(null));
  }

  render() {
    const { user, showAlertStatus } = this.props;
    return (
      <Navbar bg="dark" variant="dark" className="d-flex justify-content-between shadow">
        <Nav>
          <Navbar.Brand className="text-danger" href="#home">Pokan</Navbar.Brand>
          {user.isLogged && (
            <ProjectsModal />
          )}
        </Nav>
        {showAlertStatus.show && <AlertStatus />}
        <Nav>
          {!user.isLogged && (
            <Button onClick={() => this.showSignUpIn('signin')} variant="outline-danger m-1">
              <FaUserCheck className="react-icons" /> Signin
            </Button>
          )}
          {user.isLogged && (
            <Button onClick={() => this.showSignOut('signin')} variant="outline-danger m-1">
              <FaSignOutAlt className="react-icons" /> Signout
            </Button>
          )}
          {!user.isLogged && (
            <Button onClick={() => this.showSignUpIn('signup')} variant="outline-danger m-1">
              <FaUserPlus className="react-icons" /> Signup
            </Button>
          )}
        </Nav>
      </Navbar>
    );
  }
}

AppBar.propTypes = {
  dispatch: PropTypes.func,
  show: PropTypes.string,
  showAlertStatus: PropTypes.PropTypes.shape({
    title: PropTypes.string,
    text: PropTypes.string,
    show: PropTypes.bool,
    variant: PropTypes.string,
  }),
  user: PropTypes.PropTypes.shape({
    jwt: PropTypes.string,
    userid: PropTypes.string,
    isLogged: PropTypes.bool,
  }),
};

AppBar.defaultProps = {
  dispatch: () => {},
  show: '',
  showAlertStatus: {
    title: '',
    text: '',
    show: false,
    variant: '',
  },
  user: {
    jwt: '',
    userid: '',
    isLogged: false,
  },
};

export default connect(mapStateToProps)(AppBar);
