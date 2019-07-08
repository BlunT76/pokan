/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaPlusCircle } from 'react-icons/fa';
import {
  Row, Button, Form, Card,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { setTasksData, resetTasksData, setShowAlertStatus } from '../store/Actions';
import apiGet from '../api/apiGet';
import apiPost from '../api/apiPost';
// import apiDelete from '../api/apiDelete';

const mapStateToProps = (state) => {
  const {
    user, projects, lists, selectedProjectId, tasks,
  } = state;
  return {
    user, projects, lists, selectedProjectId, tasks,
  };
};

class Tasks extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      desc: '',
      listId: null,
    };
  }

  componentDidMount() {
    this.getTasks();
  }

  componentWillReceiveProps(nextProps) {
    const { fakeProps, dispatch } = this.props;
    if (nextProps.fakeProps !== fakeProps) {
      // fakeProps is a hack to force render of Tasks component after drag n drop
      dispatch(resetTasksData());
      this.getTasks();
    }
  }

  getTasks = async () => {
    const { dispatch, user, listid } = this.props;
    const response = await apiGet(user.jwt, 'tasks', listid);
    if (response.status === 200 && response.data.length > 0) {
      for (let i = 0; i < response.data.length; i += 1) {
        dispatch(setTasksData(response.data[i]));
      }
    }
  }

  postTasks = async (event) => {
    event.preventDefault();
    const { dispatch, user, rerender } = this.props;
    const { desc, listId } = this.state;

    const data = { desc, lists_id: listId, users_id: user.userid };
    const res = await apiPost(user.jwt, 'tasks', data);
    if (res.status === 200) {
      dispatch(resetTasksData());
      rerender(data);
      this.setState({ desc: '' });
      dispatch(setShowAlertStatus({
        title: 'Success',
        text: 'New Task created',
        show: true,
        variant: 'success',
      }));
    }
  }

  onDragStart = (event, id) => {
    event.dataTransfer.setData('id', id); // “text/plain” au lieu de "id" pour firefox ie (a verifier)
  }

  handleChange(event) {
    const { listid } = this.props;
    this.setState({
      [event.target.name]: event.target.value,
      listId: listid,
    });
  }

  render() {
    const { tasks, listid } = this.props;
    const { desc } = this.state;

    return (
      <div className="m-0">

        <Row className="p-2">
          <div className="m-3 tasks">
            {tasks.map((e) => {
              if (e.lists_id === listid) {
                return (
                  <Card
                    userid={e.users_id}
                    className="p-0 draggable mb-1 shadow-sm"
                    onDragStart={
                      elm => this.onDragStart(elm, JSON.stringify({ id: e.id, desc: e.desc, lists_id: e.lists_id }))
                    }
                    draggable="true"
                    name={e.id}
                    key={e.id}
                  >
                    <Card.Body className="m-0 text-left text-wrap">{e.desc}</Card.Body>
                    <Card.Footer>test</Card.Footer>
                  </Card>
                );
              }
              return null;
            })}
          </div>
        </Row>
        <hr />
        {listid && (
          <Form onSubmit={this.postTasks}>
            <Form.Group className="d-inline-flex m-1">
              <Form.Control
                type="text"
                placeholder="add a task"
                autoComplete="title"
                name="desc"
                value={desc}
                onChange={this.handleChange}
                required
                size="sm"
                className="no-border"
              />
              <Form.Control
                type="hidden"
                name="listId"
                value={listid}
                onLoad={this.handleChange}
              />
              <Button variant="outline-danger m-1 pt-0 pb-0 pl-1 pr-1" type="submit" size="small">
                <FaPlusCircle className="react-icons" />
              </Button>
            </Form.Group>
          </Form>
        )}
      </div>
    );
  }
}

Tasks.propTypes = {
  dispatch: PropTypes.func,
  user: PropTypes.PropTypes.shape({
    jwt: PropTypes.string,
    userid: PropTypes.string,
    isLogged: PropTypes.bool,
  }),
};

Tasks.defaultProps = {
  dispatch: () => {},
  user: {
    jwt: '',
    userid: '',
    isLogged: false,
  },
};

export default connect(mapStateToProps)(Tasks);
