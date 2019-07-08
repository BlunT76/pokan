import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setShowAlertStatus } from '../store/Actions';

const mapStateToProps = (state) => {
  const { showAlertStatus } = state;
  return { showAlertStatus };
};

class AlertStatus extends PureComponent {
  dismissAlert = () => {
    const { dispatch } = this.props;
    setTimeout(() => {
      dispatch(setShowAlertStatus({
        title: '',
        text: '',
        show: false,
        variant: '',
      }));
    }, 3000);
  }

  render() {
    const { showAlertStatus } = this.props;
    this.dismissAlert();
    return (
      <Alert variant={showAlertStatus.variant} className="m-0 p-2">
        <span>
          {showAlertStatus.title}: {showAlertStatus.text}
        </span>
      </Alert>
    );
  }
}

AlertStatus.propTypes = {
  dispatch: PropTypes.func,
  showAlertStatus: PropTypes.PropTypes.shape({
    title: PropTypes.string,
    text: PropTypes.string,
    show: PropTypes.bool,
    variant: PropTypes.string,
  }),
};

AlertStatus.defaultProps = {
  dispatch: () => {},
  showAlertStatus: {
    title: '',
    text: '',
    show: true,
  },
};

export default connect(mapStateToProps)(AlertStatus);
