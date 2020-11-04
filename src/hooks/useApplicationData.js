import { useEffect, useReducer } from "react";
import axios from "axios";

export const useApplicationData = function() {

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  useEffect(() => {
    const socket = new WebSocket("wss://interview-scheduler-sm.herokuapp.com/");
    socket.onopen = function(event) {
      socket.send("ping");
    }
    socket.onmessage = function(event) {
      const data = JSON.parse(event.data);
      if (data.type === SET_INTERVIEW) {
        dispatch({type: data.type, id: data.id, interview: data.interview})
      }
    }
  },[]);

  const updateSpots = function(day, days, appointments) {

    const dayObj = days.find(item => item.name === day);
    const appointmentIds = dayObj.appointments;

    let spots = 0;
    for (const id of appointmentIds) {
      const appointment = appointments[id];
      if (!appointment.interview) {
        spots++;
      }
    }
    dayObj.spots = spots;
  }

  function reducer(state, action) {

    switch(action.type) {
      case SET_DAY:
        return {
          ...state,
          day: action.day
        };
      case SET_APPLICATION_DATA:
        return {
          ...state,
          days: action.days,
          appointments: action.appointments,
          interviewers: action.interviewers
        };
      case SET_INTERVIEW:
        const appointment = {
          ...state.appointments[action.id],
          interview: action.interview
        }
        const appointments = {
          ...state.appointments,
          [action.id]: appointment
        }
        updateSpots(state.day, state.days, appointments);
        return {
          ...state,
          appointments
        };
        
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        )
    } 
  }

  const [state, dispatch] = useReducer(reducer, {
    days: [],
    day: "Monday",
    appointments: {},
    interviewers: {}
  })

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers'),
    ]).then((all) => {
      dispatch({type: SET_APPLICATION_DATA, days: all[0].data, appointments: all[1].data, interviewers: all[2].data})
    });
  },[]);

  const setDay = (day) => dispatch({type: SET_DAY, day});


  const cancelInterview = function(id) {
    
    const appointment = {
      ...state.appointments[id],
      interview: null
    }

    return axios.delete(`/api/appointments/${id}`, {...appointment})
    .then(() => {
      console.log("in deleting");
      dispatch({type: SET_INTERVIEW, id, interview: null})
    })
  };

  const bookInterview = function(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    return axios.put(`/api/appointments/${id}`, {...appointment})
    .then(() => {
      dispatch({type: SET_INTERVIEW, id, interview});
    })
  };

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
}