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

const ALLOWED_STATUSES = ["pending", "activated",  "deactivated"]

/**
 * UpdatePolicyStatus
 * ------------
 * Updates the policy status for given policy.
 * 
 * Variables:
 * - PolicyID: integer
 * - Status: "pending" | "activated" | "deactivated"
 * 
 * Return Variables:
 * - Status: "pending" | "activated" | "deactivated"
 */
client.subscribe("UpdatePolicyStatus", {
    tenantIdIn: ["showcase"]
}, async ({
    task,
    taskService
}) => {
    const policyId = task.variables.getTyped("PolicyID");
    const toBeStatus = task.variables.getTyped("Status");

    // check if valid types
    if (policyId.type !== "integer")
        taskService.handleBpmnError(task, "INVALID_TYPE", "PolicyID has to be of type integer.")
        
    if (toBeStatus.type !== "string" || !ALLOWED_STATUSES.includes(toBeStatus.value))
        taskService.handleBpmnError(task, "INVALID_TYPE", `Status has to be of type string and and of ${ALLOWED_STATUSES.map(s => `"${s}"`).join(", ")}.`)

    // change status
    if (Math.random() < 0.01) // 1% chance of failure
        taskService.handleBpmnError(task, "CHANGE_FAILED", "Failed to change the policy status.")

    const processVariables = new Variables()
        .set("Status", toBeStatus)

    try {
        taskService.complete(task, processVariables);
        console.log("I completed my task successfully!!");
    } catch (e) {
        console.error(`Failed completing my task, ${e}`);
    }
});