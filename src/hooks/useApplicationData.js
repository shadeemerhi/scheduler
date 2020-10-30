import React, { useState, useEffect } from "react";
import axios from "axios";

export const useApplicationData = function() {

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

  const updateSpots = function(keyWord, day, days) {

    const dayOfInterestArr = days.filter((currDay) => currDay.name === day); // Monday
    const dayOfInterest = dayOfInterestArr[0];
    if (keyWord == "Delete") {
      dayOfInterest.spots += 1;
    } else {
      dayOfInterest.spots -= 1;
    }
    setState({
      ...state,

    })

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

    updateSpots("Delete", state.day, state.days);

    return axios.delete(`/api/appointments/${id}`, {...appointment})
    .then(() => setState({
      ...state,
      appointments
    }))

  }

  const bookInterview = function(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };


    updateSpots("Increase", state.day, state.days);

    return axios.put(`/api/appointments/${id}`, {...appointment})
    .then(() => setState({
      ...state,
      appointments
    }))
  };

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
}