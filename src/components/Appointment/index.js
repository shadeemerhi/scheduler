import React, { Fragment } from "react";

import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import { useVisualMode } from "hooks/useVisualMode";
import { transformAsync } from "@babel/core";
import Status from "./Status";
import Confirm from "./Confirm";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";

export default function Appointment(props) {

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = function(name, interviewer) {
    transition(SAVING);
    const interview = {
      student: name,
      interviewer
    }
    const dbPromise = props.bookInterview(props.id, interview)
    dbPromise.then(() => transition(SHOW));
  };
  
  const deleteInterview = function() {
    transition(DELETING);
    const dbPromise = props.cancelInterview(props.id)
    dbPromise.then(() => transition(EMPTY));
  }


  return(
    <article className="appointment">
      <Header time={props.time}/>
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)}/>}
        {mode === SHOW && (
          <Show 
            student={props.interview.student} 
            interviewer={props.interview.interviewer}
            onDelete={() => transition(CONFIRM)}
          />
        )}
        {mode === CREATE && <Form interviewers={props.interviewers} onSave={save} onCancel={back}/>}
        {mode === SAVING && <Status message={"Saving"}/>}
        {mode === DELETING && <Status message={"Deleting"}/>}
        {mode === CONFIRM && <Confirm onCancel={back} onConfirm={deleteInterview}/>}
    </article>
  );
}