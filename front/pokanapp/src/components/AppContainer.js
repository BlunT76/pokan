import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Lists from './Lists';


const mapStateToProps = (state) => {
  const {
    user, projects, isFetching, show, showAlertStatus,
  } = state;
  return {
    user, projects, isFetching, show, showAlertStatus,
  };
};

class AppContainer extends PureComponent {
  render() {
    const { show } = this.props;
    return (
      <Container fluid="true" className="p-3 flex-nowrap dark-theme">
        {show === 'signin' && <SignIn />}
        {show === 'signup' && <SignUp />}
        {show === 'kanban' && <Lists />}
      </Container>
    );
  }
}

AppContainer.propTypes = {
  show: PropTypes.string,
};

AppContainer.defaultProps = {
  show: 'signin',
};

export default connect(mapStateToProps)(AppContainer);
