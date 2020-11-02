import React from "react";

import { render, cleanup, waitForElement, fireEvent } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Renders without crashing", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);
    return waitForElement(() => getByText("Monday")).then(() => {
      const tuesdayBtn = getByText("Tuesday");
      fireEvent.click(tuesdayBtn);
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });
});