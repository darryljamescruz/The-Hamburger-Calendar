import nodemailer from "nodemailer";
import sendEmail from "../../src/services/emailer";

jest.mock("nodemailer");

describe("sendEmail", () => {
  const sendEmailMock = jest.fn();

  beforeEach(() => {
    nodemailer.createTransport.mockReturnValue({
      sendMail: sendEmailMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Sends a basic email", () => {
    sendEmailMock.mockImplementation((mailDetails, callBack) => {
      callBack(null, { response: "OK" });
    });

    sendEmail("test@test.com", "Hello world", "Test Subject");

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: "gmail",
      auth: {
        user: "calendarhamburger@gmail.com",
        pass: process.eventNames.APP_PASSWORD,
      },
    });

    expect(sendEmailMock).toHaveBeenCalledWith(
      {
        from: "calendarhamburger@gmail.com",
        to: "test@test.com",
        subject: "Test Subject",
        text: "Hello world",
      },
      expect.any(Function)
    );
  });

  it("Sends a failing email", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    sendEmailMock.mockImplementation((mailDetails, callBack) => {
      callBack(new Error("Failed to send"), null);
    });

    sendEmail(
      "test@test.com",
      "This email should fail",
      "Failing Email Test Subject"
    );

    expect(consoleSpy).toHaveBeenCalledWith("❌ Error:", expect.any(Error));
    consoleSpy.mockRestore();
  });
});
