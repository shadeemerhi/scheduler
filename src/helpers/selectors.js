const getAppointmentsForDay = function(state, day) {

  let output = [];
  let appointmentsArr = null;
  if (state.days.length === 0) {
    return [];
  }
  for (const dayObj of state.days) {
    if (dayObj.name === day) {
      appointmentsArr = dayObj.appointments;
    }
  }

  if (!appointmentsArr) {
    return [];
  }

  for (const appID of appointmentsArr) {
    for (const key in state.appointments) {
      if (parseInt(key) === appID) {
        output.push(state.appointments[key])
        break;
      }
    }
  }

  return output;
}

const interviewers =  {
  "1": {  
    "id": 1,
    "name": "Sylvia Palmer",
    "avatar": "https://i.imgur.com/LpaY82x.png"
  },
  "2": {
    id: 2,
    name: "Tori Malcolm",
    avatar: "https://i.imgur.com/Nmx0Qxo.png"
  }
}

const getInterview = function(state, interview) {
  const output = {};
  
  if (!interview) {
    return null;
  }

  const interviewer = state.interviewers[interview.interviewer];
  output["student"] = interview.student;
  output["interviewer"] = interviewer;
  return output;
}

module.exports = { getAppointmentsForDay, getInterview };