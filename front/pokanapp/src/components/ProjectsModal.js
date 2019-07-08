import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Modal, ListGroup, Row, Form, Col, OverlayTrigger, Tooltip,
} from 'react-bootstrap';
import {
  FaTrashAlt, FaPlusCircle, FaRegListAlt,
} from 'react-icons/fa';
import { connect } from 'react-redux';
import {
  setProjectsData, setSelectedProjectId, setListsData, resetTasksData, setShowAlertStatus,
} from '../store/Actions';
import apiGet from '../api/apiGet';
import apiPost from '../api/apiPost';
import apiDelete from '../api/apiDelete';

const mapStateToProps = (state) => {
  const {
    user, projects, lists,
  } = state;
  return {
    user, projects, lists,
  };
};

class ProjectsModal extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      show: true,
      name: '',
    };
  }

  componentDidMount() {
    this.getProjects();
  }

  getProjects = async () => {
    const { dispatch, user } = this.props;
    const response = await apiGet(user.jwt, 'projects');
    if (response.status === 200 && response.data.length > 0) {
      dispatch(setProjectsData(response.data));
    } else {
      dispatch(setShowAlertStatus({
        title: 'Error',
        text: 'A problem occured while fetching the list of projects',
        show: true,
        variant: 'danger',
      }));
    }
  }

  loadProject = async (projectId) => {
    const { dispatch, user } = this.props;
    dispatch(setListsData([]));
    const response = await apiGet(user.jwt, 'lists', +projectId);
    if (response.status !== 200) {
      dispatch(setShowAlertStatus({
        title: 'Error',
        text: 'A problem occured while loading a project',
        show: true,
        variant: 'danger',
      }));
      return null;
    }
    if (response.status === 200 && response.data.length > 0) {
      dispatch(setListsData(response.data));
    }
    dispatch(setSelectedProjectId(projectId));
    dispatch(resetTasksData());
    this.handleClose();
  }

  postProjects = async (event) => {
    event.preventDefault();
    const { dispatch, user } = this.props;
    const { name } = this.state;
    const data = { name, users_id: user.userid };
    const res = await apiPost(user.jwt, 'projects', data);
    if (res.status === 200) {
      this.getProjects();
      dispatch(setShowAlertStatus({
        title: 'Success',
        text: 'New Project created',
        show: true,
        variant: 'success',
      }));
    }
  }

  deleteProjects = async (projectId) => {
    const { user, dispatch } = this.props;
    const res = await apiDelete(user.jwt, 'projects', projectId);
    if (res.data === 1) {
      this.getProjects();
      dispatch(setShowAlertStatus({
        title: 'Success',
        text: 'Project deleted',
        show: true,
        variant: 'success',
      }));
    } else {
      dispatch(setShowAlertStatus({
        title: 'Error',
        text: 'A problem occured',
        show: true,
        variant: 'danger',
      }));
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  render() {
    const { projects, user } = this.props;
    const { name, show } = this.state;

    const listProjects = projects.map(e => (
      <ListGroup.Item
        key={e.id}
        userid={e.users_id}
        className="d-inline-flex justify-content-between align-items-center"
      >
        <OverlayTrigger
          key={e.id}
          placement="left"
          overlay={(
            <Tooltip id={e.id}>
              Load <strong>{e.name}</strong>.
            </Tooltip>
          )}
        >
          <ListGroup.Item
            key={e.id}
            userid={e.users_id}
            className="projectsList"
            action
            onClick={() => this.loadProject(e.id)}
          >
            <h5 className="">{e.name}</h5>
          </ListGroup.Item>
        </OverlayTrigger>
        <div className="d-inline-flex justify-content-between align-items-center">
          <OverlayTrigger
            key={e.id}
            placement="right"
            overlay={(
              <Tooltip id={e.id}>
                Delete <strong>{e.name}</strong>.
              </Tooltip>
            )}
          >
            <Button onClick={() => this.deleteProjects(e.id)} variant="outline-danger m-1">
              <FaTrashAlt className="react-icons" />
            </Button>
          </OverlayTrigger>
        </div>

      </ListGroup.Item>
    ));
    return (
      <>
        {user.isLogged && (
          <Button onClick={this.handleShow} variant="outline-danger m-1">
            <FaRegListAlt className="react-icons" /> My Projects
          </Button>
        )}

        <Modal show={show} onHide={this.handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>My Projects</Modal.Title>
          </Modal.Header>
          <Row className="mt-2 p-2">
            <Col className="p-2 m-2">
              <ListGroup>
                {listProjects}
              </ListGroup>
              <ListGroup.Item className="mt-2 pb-0">
                <Form onSubmit={this.postProjects} className="">
                  <Form.Label className="text-danger mr-2">Create New Project</Form.Label>
                  <Form.Group controlId="formBasicPassword" className="d-inline-flex">
                    <Form.Control
                      type="text"
                      placeholder="Project Name"
                      autoComplete="name"
                      name="name"
                      value={name}
                      onChange={this.handleChange}
                      required
                    />
                    <Button variant="outline-danger ml-2" type="submit">
                      <FaPlusCircle className="react-icons" />
                    </Button>
                  </Form.Group>
                </Form>
              </ListGroup.Item>
            </Col>
          </Row>
        </Modal>
      </>
    );
  }
}

ProjectsModal.propTypes = {
  dispatch: PropTypes.func,
  user: PropTypes.PropTypes.shape({
    jwt: PropTypes.string,
    userid: PropTypes.string,
    isLogged: PropTypes.bool,
  }),
  projects: PropTypes.arrayOf(PropTypes.object),
};

ProjectsModal.defaultProps = {
  dispatch: () => {},
  user: {
    jwt: '',
    userid: '',
    isLogged: false,
  },
  projects: [],
};
export default connect(mapStateToProps)(ProjectsModal);
