import React from 'react';
import "components/DayListItem.scss";
const classNames = require('classnames');

export default function DayListItem(props) {

  return(
    <li onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{props.spots} spots remaining</h3>
    </li>
  );
}