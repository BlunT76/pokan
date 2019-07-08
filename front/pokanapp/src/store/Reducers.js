import {
  SET_USER_DATA,
  SET_PROJECTS_DATA,
  SET_LISTS_DATA,
  SET_TASKS_DATA,
  EDIT_TASKS_DATA,
  RESET_TASKS_DATA,
  SET_IS_FETCHING,
  SET_SHOW,
  SET_SHOW_ALERTSTATUS,
  SET_SELECTED_PROJECT_ID,
} from './Actions';


const initialState = {
  user: {
    jwt: null,
    userid: null,
    isLogged: false,
  },
  projects: [],
  lists: [],
  tasks: [],
  isFetching: false,
  show: 'signin',
  showAlertStatus: {},
  selectedProjectId: null,
};

const pokanReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_DATA: {
      return {
        ...state,
        user: action.payload,
      };
    }
    case SET_PROJECTS_DATA: {
      return {
        ...state,
        projects: action.payload,
      };
    }
    case SET_LISTS_DATA: {
      return {
        ...state,
        lists: action.payload,
      };
    }
    case SET_TASKS_DATA: {
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    }
    case RESET_TASKS_DATA: {
      return {
        ...state,
        tasks: [],
      };
    }
    case EDIT_TASKS_DATA: {
      const { tasks } = state;
      return tasks.map((item, index) => {
        if (item.id === action.payload.id) {
          console.log(item, action.payload.id)
          return {
            ...item, // copy the existing item
            item: action.payload.lists_id, // replace the email addr
          };
        }
        console.log(item)
        return item;
      });
    }
    case SET_IS_FETCHING:
      return {
        ...state,
        isFetching: action.payload,
      };
    case SET_SHOW:
      return {
        ...state,
        show: action.payload,
      };
    case SET_SHOW_ALERTSTATUS:
      return {
        ...state,
        showAlertStatus: action.payload,
      };
    case SET_SELECTED_PROJECT_ID:
      return {
        ...state,
        selectedProjectId: action.payload,
      };
    default:
      return state;
  }
};
export default pokanReducer;
