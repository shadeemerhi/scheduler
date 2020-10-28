const getAppointmentsForDay = function(state, day) {

  let output = [];
  let appointmentsArr = null;
  if (state.days.length === 0) {
    console.log('Empty array');
    return [];
  }
  for (const dayObj of state.days) {
    if (dayObj.name === day) {
      appointmentsArr = dayObj.appointments;
      console.log('appointmentsArr :', appointmentsArr);
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

module.exports = { getAppointmentsForDay };