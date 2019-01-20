  const {
    Client,
    logger,
    Variables
  } = require("camunda-external-task-client-js");
  var unirest = require("unirest");
  
  const client = new Client({
    baseUrl: "https://digibp-camunda.herokuapp.com/rest",
    use: logger,
    asyncResponseTimeout: 29000
  });
  
  client.subscribe("echoService", async ({
    task,
    taskService
  }) => {
    const variableA = task.variables.get("variableA");
    const variableB = task.variables.get("variableB");

    var req = unirest("POST", "https://www.putsreq.com/tYQr1JuRPp8xsVsRuv8u");

    req.headers({
      "Content-Type": "application/json"
    });

    req.type("json");
    req.send({
      "variableA": variableA,
      "variableB": variableB
    });

    req.end(async function (res) {
      if (res.error) throw new Error(res.error);
      console.log(res.body);

      const processVariables = new Variables()
        .set("variableA", res.body.variableA)
        .set("variableB", res.body.variableB);
  
      try {
          await taskService.complete(task, processVariables);
          console.log("I completed my task successfully!!");
      } catch (e) {
          console.error(`Failed completing my task, ${e}`);
      }
    });
  });