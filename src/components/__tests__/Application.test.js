import React from "react";

import { render, cleanup, waitForElement, fireEvent, getByText, 
        prettyDOM, wait, getAllByAltText, getAllByTestId, getByAltText, 
        getByPlaceholderText, queryByText } from "@testing-library/react";

import Application from "components/Application";
import WS from "jest-websocket-mock";
import axios from "axios";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const server = new WS("ws://localhost:8001");
    const { getByText } = render(<Application />);
    return waitForElement(() => getByText("Monday")).then(() => {
      const tuesdayBtn = getByText("Tuesday");
      fireEvent.click(tuesdayBtn);
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
      server.close();
    });
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const server = new WS("ws://localhost:8001");
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    server.send('{ "id": "1", "interview": { "student": "Lydia Miller-Jones", "interviewer": "1" }, "type": "SET_INTERVIEW" }');
    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));
    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();
    const days = getAllByTestId(container, "day");
    const day = days.find(day => queryByText(day, "Monday"));
    expect(queryByText(day, "no spots remaining")).toBeInTheDocument();
    server.close();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday to 2", async () => {
    const server = new WS("ws://localhost:8001");
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(appointment => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Delete"));

    expect(queryByText(appointment, "Delete the appointment?")).toBeInTheDocument();

    fireEvent.click(queryByText(appointment, "Confirm"));

    expect(queryByText(appointment, "Deleting")).toBeInTheDocument();
    server.send('{ "id": "1", "interview": null, "type": "SET_INTERVIEW" }');
    await waitForElement(() => getByAltText(appointment, "Add"));

    const days = getAllByTestId(container, "day");
    const day = days.find(day => queryByText(day, "Monday"));
    expect(queryByText(day, "2 spots remaining")).toBeInTheDocument();
    server.close();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const server = new WS("ws://localhost:8001");
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(appointment => queryByText(appointment, "Archie Cohen"));

    fireEvent.click(getByAltText(appointment, "Edit"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByText(appointment, "Save"));
    expect(queryByText(appointment, "Saving")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const days = getAllByTestId(container, "day");
    const day = days.find(day => queryByText(day, "Monday"));
    expect(queryByText(day, "1 spot remaining")).toBeInTheDocument();
    server.close();
  });

  it("shows the save error when failing to save an appointment", async () => {

    const server = new WS("ws://localhost:8001");
    axios.put.mockRejectedValueOnce();
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => queryByText(appointment, "There was an error saving your appointment"));
    expect(getByText(appointment, "Error")).toBeInTheDocument();
    fireEvent.click(getByAltText(appointment, "Close"));
    expect(getByAltText(appointment, "Add")).toBeInTheDocument();

    const days = getAllByTestId(container, "day");
    const day = days.find(day => queryByText(day, "Monday"));
    expect(queryByText(day, "1 spot remaining")).toBeInTheDocument();
    server.close();
  });

  it("shows the delete error when failing to delete an appointment", async () => {

    const server = new WS("ws://localhost:8001");
    axios.delete.mockRejectedValueOnce();
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(appointment => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Delete"));

    expect(queryByText(appointment, "Delete the appointment?")).toBeInTheDocument();

    fireEvent.click(queryByText(appointment, "Confirm"));

    expect(queryByText(appointment, "Deleting")).toBeInTheDocument();

    await waitForElement(() => queryByText(appointment, "There was an error deleting your appointment"));
    expect(getByText(appointment, "Error")).toBeInTheDocument();
    fireEvent.click(getByAltText(appointment, "Close"));
    expect(getByText(container, "Archie Cohen")).toBeInTheDocument();

    const days = getAllByTestId(container, "day");
    const day = days.find(day => queryByText(day, "Monday"));
    expect(queryByText(day, "1 spot remaining")).toBeInTheDocument();
    server.close();
  });
});