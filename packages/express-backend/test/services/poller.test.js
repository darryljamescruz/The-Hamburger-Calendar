jest.mock("../../src/models/reminder.js");
jest.mock("../../src/services/emailer");

import { pollReminders } from "../../src/services/poller.js";
import Reminder from "../../src/models/reminder.js";
import sendEmail from "../../src/services/emailer";

describe("pollReminders", () => {
  it("Sends email when required, updating status", async () => {
    const mockReminder = {
      recipient_email: "test@test.com",
      email_body: "Upcoming event",
      sent: false,
      save: jest.fn().mockResolvedValue(true),
    };

    Reminder.find.mockResolvedValue([mockReminder]);
    sendEmail.mockImplementation(() => {});

    await pollReminders();

    expect(sendEmail).toHaveBeenCalledWith(
      "test@test.com",
      "Upcoming event",
      "Event Reminder"
    );

    expect(mockReminder.sent).toBe(true);
    expect(mockReminder.save).toHaveBeenCalled();
  });

  it("Logs error when failing to send email", async () => {
    const mockReminder = {
      recipient_email: "test@test.com",
      email_body: "Failing email",
      sent: false,
      save: jest.fn(),
    };

    Reminder.find.mockResolvedValue([mockReminder]);
    sendEmail.mockImplementation(() => {
      throw new Error("Failed to send email");
    });

    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await pollReminders();

    expect(consoleError).toHaveBeenCalledWith(
      "Failed to send to test@test.com",
      expect.any(Error)
    );

    consoleError.mockRestore();
  });
});
