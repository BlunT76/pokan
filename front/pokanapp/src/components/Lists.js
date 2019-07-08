/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { FaTrashAlt, FaPlusCircle } from 'react-icons/fa';
import {
  Row, Col, ListGroup, Button, Form,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { setListsData, setShowAlertStatus } from '../store/Actions';
import apiGet from '../api/apiGet';
import apiPost from '../api/apiPost';
import apiDelete from '../api/apiDelete';
import apiPut from '../api/apiPut';
import Tasks from './Tasks';

const mapStateToProps = (state) => {
  const {
    user, projects, lists, selectedProjectId,
  } = state;
  return {
    user, projects, lists, selectedProjectId,
  };
};

class Lists extends PureComponent {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      title: '',
      fakeProps: {},
    };
  }

  getLists = async () => {
    const { dispatch, user, selectedProjectId } = this.props;
    const response = await apiGet(user.jwt, 'lists', +selectedProjectId);
    if (response.status === 200 && response.data.length > 0) {
      dispatch(setListsData(response.data));
    } else {
      dispatch(setShowAlertStatus({
        title: 'Error',
        text: 'A problem occured while fetching the lists',
        show: true,
        variant: 'danger',
      }));
    }
  }

  postLists = async (event) => {
    event.preventDefault();
    const { dispatch, user, selectedProjectId } = this.props;
    const { title } = this.state;
    const data = { title, projects_id: selectedProjectId, users_id: user.userid };
    const res = await apiPost(user.jwt, 'lists', data);
    if (res.status === 200) {
      this.getLists();
      dispatch(setShowAlertStatus({
        title: 'Success',
        text: 'New List created',
        show: true,
        variant: 'success',
      }));
    }
  }

  deleteList = async (listId) => {
    const { user, dispatch } = this.props;
    const res = await apiDelete(user.jwt, 'lists', listId);
    if (res.data === 1) {
      this.getLists();
      dispatch(setShowAlertStatus({
        title: 'Success',
        text: 'Project deleted',
        show: true,
        variant: 'success',
      }));
    } else {
      dispatch(setShowAlertStatus({
        title: 'Error',
        text: 'A problem occured while deleting a list',
        show: true,
        variant: 'danger',
      }));
    }
  }

  putTasks = async (idTask, idList) => {
    const { user, dispatch } = this.props;
    const task = JSON.parse(idTask);
    const data = {
      id: task.id,
      desc: task.desc,
      lists_id: idList,
      users_id: user.userid,
    };
    if (task.lists_id === idList) {
      return null;
    }
    const response = await apiPut(user.jwt, 'tasks', data, task.id);
    if (response.data === 1) {
      dispatch(setShowAlertStatus({
        title: 'Success',
        text: 'Task updated',
        show: true,
        variant: 'success',
      }));
      this.fakeUpdate(data);
    } else {
      dispatch(setShowAlertStatus({
        title: 'Error',
        text: 'A problem occured while adding a task',
        show: true,
        variant: 'danger',
      }));
    }
  }

  fakeUpdate = (elm) => {
    this.setState({ fakeProps: elm });
  }

  deleteTask = async (taskId) => {
    const { user, dispatch } = this.props;
    const res = await apiDelete(user.jwt, 'tasks', taskId);
    if (res.data === 1) {
      dispatch(setShowAlertStatus({
        title: 'Success',
        text: 'Task deleted',
        show: true,
        variant: 'success',
      }));
      this.fakeUpdate({});
    } else {
      dispatch(setShowAlertStatus({
        title: 'Error',
        text: 'A problem occured while deleting a task',
        show: true,
        variant: 'danger',
      }));
    }
  }

  onDragOver = (event) => {
    event.preventDefault();
  }

  onDrop = (event, cat) => {
    const id = event.dataTransfer.getData('id');
    this.putTasks(id, cat);
  }

  onDropDelete = (event, cat) => {
    const item = event.dataTransfer.getData('id');
    const { id } = JSON.parse(item);
    this.deleteTask(id);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const { lists, selectedProjectId } = this.props;
    const { title, fakeProps } = this.state;

    return (
      <Col className="m-0">
        <div
          className="trash float-right text-danger"
          onDragOver={elm => this.onDragOver(elm)}
          onDrop={elm => this.onDropDelete(elm)}
        >
          <FaTrashAlt className="react-icons" size="48px" />
        </div>
        {selectedProjectId && (
        // <ListGroup.Item className="shadow-lg w-25">
          <Form onSubmit={this.postLists} className="w-25 d-inline-flex p-0 ml-2">
            {/* <Form.Label className="text-danger">New List</Form.Label> */}
            {/* <Form.Group className="d-inline-flex p-0"> */}
            <Form.Control
              type="text"
              placeholder="Add a list"
              autoComplete="title"
              className="w-50"
              name="title"
              value={title}
              onChange={this.handleChange}
              required
            />
            <Button variant="outline-danger ml-1 rounded round" type="submit">
              <FaPlusCircle className="react-icons" size="24px" />
            </Button>
            {/* </Form.Group> */}
          </Form>
        )}

        <Row className="p-2">
          {lists.length > 0 && lists.map(e => (
            <div
              key={e.id}
              onDragOver={elm => this.onDragOver(elm)}
              onDrop={elm => this.onDrop(elm, e.id)}
              className="col-2 p-0"
            >
              <ListGroup className="shadow-lg m-3 list">
                <ListGroup.Item key={e.id} userid={e.users_id} className="d-inline-flex justify-content-between align-items-center p-0 border border-white">
                  <h5 className="m-0 ml-5 text-center">{e.title}</h5>
                  <div>
                    <Button
                      onClick={() => this.deleteList(e.id)}
                      size="small"
                      variant="outline-danger ml-auto m-2 pt-0 pb-0 pl-1 pr-1"
                    >
                      <FaTrashAlt className="react-icons" />
                    </Button>
                  </div>
                </ListGroup.Item>
                <hr />
                <Tasks listid={e.id} fakeProps={fakeProps} rerender={this.fakeUpdate} />
              </ListGroup>
            </div>
          ))}
        </Row>
      </Col>
    );
  }
}

Lists.propTypes = {
  dispatch: PropTypes.func,
  user: PropTypes.PropTypes.shape({
    jwt: PropTypes.string,
    userid: PropTypes.string,
    isLogged: PropTypes.bool,
  }),
};

Lists.defaultProps = {
  dispatch: () => {},
  user: {
    jwt: '',
    userid: '',
    isLogged: false,
  },
};

export default connect(mapStateToProps)(Lists);
