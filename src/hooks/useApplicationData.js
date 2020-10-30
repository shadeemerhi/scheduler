import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";

export const useApplicationData = function() {

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  function reducer(state, action) {
    console.log(action.type);

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

    // days: [],
    // day: "Monday",
    // appointments: {},
    // interviewers: {}

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers'),
    ]).then((all) => {
      console.log(all);
      // setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
      dispatch({type: SET_APPLICATION_DATA, days: all[0].data, appointments: all[1].data, interviewers: all[2].data})
    });
  },[]);

  const setDay = (day) => dispatch({type: SET_DAY, day});

  const updateSpots = function(removing, day, days) {

    const dayOfInterestArr = days.filter((currDay) => currDay.name === day);
    const dayOfInterest = dayOfInterestArr[0];
    if (removing) {
      dayOfInterest.spots += 1;
    } else {
      dayOfInterest.spots -= 1;
    }
  }

  const cancelInterview = function(id) {
    
    const appointment = {
      ...state.appointments[id],
      interview: null
    }

    // const appointments = {
    //   ...state.appointments,
    //   [id]: appointment
    // }

    return axios.delete(`/api/appointments/${id}`, {...appointment})
    .then(() => {
      console.log("in deleting");
      updateSpots(true, state.day, state.days);
      dispatch({type: SET_INTERVIEW, id, interview: null})
      // setState({
      //   ...state,
      //   appointments
      // })
    })
  };

  const bookInterview = function(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    // const appointments = {
    //   ...state.appointments,
    //   [id]: appointment
    // };

    return axios.put(`/api/appointments/${id}`, {...appointment})
    .then(() => {
      if(!state.appointments[id].interview) {
        updateSpots(false, state.day, state.days);
      }
      dispatch({type: SET_INTERVIEW, id, interview});
      // setState({
      //   ...state,
      //   appointments
      // })
    })
  };

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
}