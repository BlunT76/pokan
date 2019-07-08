// src/js/actions/index.js
export const SET_USER_DATA = 'SET_USER_DATA';
export const setUserData = payload => ({ type: SET_USER_DATA, payload });

export const SET_PROJECTS_DATA = 'SET_PROJECTS_DATA';
export const setProjectsData = payload => ({ type: SET_PROJECTS_DATA, payload });

export const SET_LISTS_DATA = 'SET_LISTS_DATA';
export const setListsData = payload => ({ type: SET_LISTS_DATA, payload });

export const SET_TASKS_DATA = 'SET_TASKS_DATA';
export const setTasksData = payload => ({ type: SET_TASKS_DATA, payload });

export const RESET_TASKS_DATA = 'RESET_TASKS_DATA';
export const resetTasksData = payload => ({ type: RESET_TASKS_DATA, payload });

export const EDIT_TASKS_DATA = 'EDIT_TASKS_DATA';
export const editTasksData = payload => ({ type: EDIT_TASKS_DATA, payload });

export const SET_IS_FETCHING = 'SET_IS_FETCHING';
export const setIsFetching = payload => ({ type: SET_IS_FETCHING, payload });

export const SET_SHOW = 'SET_SHOW';
export const setShow = payload => ({ type: SET_SHOW, payload });

export const SET_SHOW_ALERTSTATUS = 'SET_SHOW_ALERTSTATUS';
export const setShowAlertStatus = payload => ({ type: SET_SHOW_ALERTSTATUS, payload });

export const SET_SELECTED_PROJECT_ID = 'SET_SELECTED_PROJECT_ID';
export const setSelectedProjectId = payload => ({ type: SET_SELECTED_PROJECT_ID, payload });
