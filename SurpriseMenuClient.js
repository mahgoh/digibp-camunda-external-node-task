const CAMUNDA_REST_URL = process.env.CAMUNDA_REST_URL || "https://digibp.herokuapp.com/rest";

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

client.subscribe("GetSurpriseMenu", {
    tenantIdIn: ["showcase"]
}, async ({
    task,
    taskService
}) => {
    const vegetarianGuests = task.variables.get("vegetarian");

    if (vegetarianGuests) {
        menu = (["pizza", "pasta", "verdura"])[Math.random() * 3 | 0];
    } else {
        menu = (["pizza", "pasta", "carne", "verdura"])[Math.random() * 4 | 0];
    }

    const processVariables = new Variables()
        .set("menu", menu);

    try {
        taskService.complete(task, processVariables);
        console.log("I completed my task successfully!!");
    } catch (e) {
        console.error(`Failed completing my task, ${e}`);
    }
});