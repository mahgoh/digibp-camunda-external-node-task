const CAMUNDA_REST_URL = process.env.CAMUNDA_REST_URL || "https://digibp.herokuapp.com/engine-rest";

const {
    Client,
    logger,
    Variables
} = require("camunda-external-task-client-js");

const client = new Client({
    baseUrl: CAMUNDA_REST_URL,
    use: logger,
    asyncResponseTimeout: 29000
});

/**
 * EvaluateRisk
 * ------------
 * Evaluates the risk for given policy.
 * 
 * Variables:
 * - ClaimAmount: float
 * 
 * Return Variables:
 * - RiskType: "low" | "medium" | "high" | "unkown"
 * - isAccepted: boolean
 */
client.subscribe("EvaluateRisk", {
    tenantIdIn: ["showcase"]
}, async ({
    task,
    taskService
}) => {
    const claimAmount = task.variables.getTyped("ClaimAmount");

    // check if valid types
    if (claimAmount.type !== "float")
        taskService.handleBpmnError(task, "INVALID_TYPE", "ClaimAmount has to be of type float.")

    // calculate risk
    let riskType = "unknown"

    if (claimAmount.value < 100)
        riskType = (Math.random() < 0.9) ? "low" : "unknown" // 10% chance of "unknown"
    else if (claimAmount.value < 500)
        riskType = (Math.random() < 0.8) ? "medium" : "unknown" // 20% chance of "unknown"
    else
        riskType = (Math.random() < 0.7) ? "high" : "unknown" // 30% chance of "unknown"
    
    // accept if "low" or "medium"
    // otherwise chance of acceptance is 50%
    const isAccepted = ["low", "medium"].includes(riskType) || Math.random() < 0.5

    const processVariables = new Variables()
        .set("RiskType", riskType)
        .set("isAccepted", isAccepted)

    try {
        taskService.complete(task, processVariables);
        console.log("I completed my task successfully!!");
    } catch (e) {
        console.error(`Failed completing my task, ${e}`);
    }
});