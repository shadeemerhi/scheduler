import React, { useState, useEffect } from "react";
import axios from "axios";
// const WebSocket = require("ws");

export const useApplicationData = function() {

  useEffect(() => {
    const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    socket.onopen = function(event) {
      socket.send("ping");
    }
  },[]);


  const [state, setState] = useState({
    days: [],
    day: "Monday",
    appointments: {},
    interviewers: {}
  });

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers'),
    ]).then((all) => {
      console.log(all);
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
    });
  },[]);

  const setDay = (day) => setState({
    ...state,
    day
  });

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

    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    return axios.delete(`/api/appointments/${id}`, {...appointment})
    .then(() => {
      updateSpots(true, state.day, state.days);
      setState({
        ...state,
        appointments
      })
    })
  };

  const bookInterview = function(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, {...appointment})
    .then(() => {
      if(!state.appointments[id].interview) {
        updateSpots(false, state.day, state.days);
      }
      setState({
        ...state,
        appointments
      })
    })
  };

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
}