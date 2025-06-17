import { scheduleReminder } from "../../src/services/scheduleReminder";
import Reminder from "../../src/models/reminder";

jest.mock("../../src/models/reminder");

describe("scheduleReminder", () => {
  it("Creates a new reminder", async () => {
    const mockData = {
      recipient_email: "test@test.com",
      email_body: "Test email body",
      send_at: new Date("2025-12-05T08:02:00Z"),
    };

    Reminder.create.mockResolvedValue(mockData);

    await scheduleReminder(
      mockData.recipient_email,
      mockData.email_body,
      mockData.send_at
    );

    expect(Reminder.create).toHaveBeenCalledWith({
      recipient_email: "test@test.com",
      email_body: "Test email body",
      send_at: new Date("2025-12-05T08:02:00Z"),
    });
  });
});
