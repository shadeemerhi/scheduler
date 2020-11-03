import React from "react";

import { render, cleanup, waitForElement, fireEvent, getByText, 
        prettyDOM, wait, getAllByAltText, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, waitForElementToBeRemoved } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);
    return waitForElement(() => getByText("Monday")).then(() => {
      const tuesdayBtn = getByText("Tuesday");
      fireEvent.click(tuesdayBtn);
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
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

    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));
    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();

    const days = getAllByTestId(container, "day");
    const day = days.find(day => queryByText(day, "Monday"));
    expect(queryByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday to 2", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(appointment => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Delete"));

    expect(queryByText(appointment, "Delete the appointment?")).toBeInTheDocument();

    fireEvent.click(queryByText(appointment, "Confirm"));

    expect(queryByText(appointment, "Deleting")).toBeInTheDocument();

    await waitForElement(() => getByAltText(appointment, "Add"));

    const days = getAllByTestId(container, "day");
    const day = days.find(day => queryByText(day, "Monday"));
    expect(queryByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {

    // Render the application
    const { container, debug } = render(<Application />);
    // Wait until Archie Cohen is displayeds
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // Click the edit button on the booked appointment
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(appointment => queryByText(appointment, "Archie Cohen"));

    fireEvent.click(getByAltText(appointment, "Edit"));
    // Change the name to Lydia Miller-Jones
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    // Click the save button
    fireEvent.click(getByText(appointment, "Save"));
    // Confirm that "Saving" is shown
    expect(queryByText(appointment, "Saving")).toBeInTheDocument();
    // Confirm that the appointment is shown with the new name
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    // Confirm that the spots remaining for Monday remain at 1
    const days = getAllByTestId(container, "day");
    const day = days.find(day => queryByText(day, "Monday"));
    expect(queryByText(day, "1 spot remaining")).toBeInTheDocument();
  });
});