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
  "RequestPremium",
  {
    tenantIdIn: ["showcase"],
  },
  async ({ task, taskService }) => {
    const agentId = task.variables.get("AgentID");
    const productId = task.variables.get("ProductID");
    const policyStartDate = task.variables.get("PolicyStartDate");
    const policyEndDate = task.variables.get("PolicyEndDate");
    const customerId = task.variables.get("CustomerID");
    const prospectName =
      customerId === undefined ? task.variables.get("ProspectName") : undefined;
    const prospectSurname =
      customerId === undefined
        ? task.variables.get("ProspectSurname")
        : undefined;
    const prospectAddress =
      customerId === undefined
        ? task.variables.get("ProspectAddress")
        : undefined;
    const prospectEmail =
      customerId === undefined
        ? task.variables.get("ProspectEmail")
        : undefined;

    const estimatedPreminum = () => {
      let premium = Math.floor(Math.random() * (200 - 100) + 100);
      if (!customerId) premium *= 2;
      return premium;
    };

    const processVariables = new Variables().set(
      "EstimatedPremium",
      estimatedPreminum
    );

    try {
      taskService.complete(task, processVariables);
      console.log("Premium was successfully estimated!!");
    } catch (e) {
      console.error(`Failed completing premium estimation`);
    }
  }
);
