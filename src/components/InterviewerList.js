import React from "react";
import InterviewerListItem from "./InterviewerListItem";
import "components/InterviewerList.scss";

export default function InterviewerList(props) {

  const { interviewers } = props;
  console.log(interviewers);

  return(
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {interviewers.map(interviewer => {
          console.log(interviewer.avatar);
          return(
            <InterviewerListItem
              key={interviewer.id}
              name={interviewer.name}
              avatar={interviewer.avatar}
              selected={interviewer.id === props.interviewer}
              setInterviewer={props.setInterviewer}
          />
          );
        })}
      </ul>
    </section>
  );
}