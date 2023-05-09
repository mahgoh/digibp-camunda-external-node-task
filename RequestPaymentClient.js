const CAMUNDA_REST_URL =
  process.env.CAMUNDA_REST_URL || "https://digibp.herokuapp.com/engine-rest";

const {
  Client,
  logger,
  Variables,
} = require("camunda-external-task-client-js");

const client = new Client({
  baseUrl: CAMUNDA_REST_URL,
  use: logger,
  asyncResponseTimeout: 29000,
});

client.subscribe(
  "RequestPayment",
  {
    tenantIdIn: ["showcase"],
  },
  async ({ task, taskService }) => {
    const invoiceNr = task.variables.get("InvoiceNr");
    const invoiceAmount = task.variables.get("InvoiceAmount");
    const issueDate = task.variables.get("IssueDate");
    const dueDate = task.variables.get("DueDate");
    const paymentReceived = task.variables.get("PaymentReceived");

    if (!issueDate) {
      issueDate = new Date();
      dueDate = new Date(issueDate.getDate() + 30);
      inDefault = false;
      paymentReceived = false;
      reminderSent = false;

      const processVariables = new Variables().setAll({
        IssueDate: issueDate,
        DueDate: dueDate,
        InDefault: inDefault,
        PaymentReceived: paymentReceived,
        ReminderSent: reminderSent,
      });
      try {
        taskService.complete(task, processVariables);
        console.log("I completed my task successfully!!");
      } catch (e) {
        console.error(`Failed completing my task, ${e}`);
      }
    }

    if (dueDate < new Date() && !paymentReceived) {
      console.log("pretend to send reminder for invoice: " + invoiceNr);
      const processVariables = new Variables().setAll({
        InDefault: true,
        PaymentDeadlineMet: false,
        ReminderSent: true,
        InvoiceAmount: invoiceAmount + 20,
      });
      try {
        taskService.complete(task, processVariables);
        console.log("I completed my task successfully!!");
      } catch (e) {
        console.error(`Failed completing my task, ${e}`);
      }
    }
  }
);
