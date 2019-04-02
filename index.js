const express = require("express");
const PORT = process.env.PORT || 5000;
const CAMUNDA_REST_URL = process.env.CAMUNDA_REST_URL || "https://digibp.herokuapp.com/rest";

express()
  .get("/", (req, res) => res.send("Camunda External Node Task"))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

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

const unirest = require("unirest");

client.subscribe("GetMenu", { tenantIdIn: ["showcase"] }, async ({ task, taskService }) => {
  var req = unirest("GET", "https://hook.integromat.com/vhk7p513e4fmz7dvgxs65okwq6lx7243");

  req.end(async function(res) {
    if (res.error) throw new Error(res.error);
    console.log(res.body);

    const processVariables = new Variables()
      .set("pizzaList", res.body.PizzaMenu);

    try {
      await taskService.complete(task, processVariables);
      console.log("I completed my task successfully!!");
    } catch (e) {
      console.error(`Failed completing my task, ${e}`);
    }
  });
});

client.subscribe("AddPizza", { tenantIdIn: ["showcase"] }, async ({ task, taskService }) => {
  const pizzaName = task.variables.get("name");

  var req = unirest("POST", "https://hook.integromat.com/bqfke9sdtrixnplwuyf99fnaken4rkc3");

  req.headers({
    "Content-Type": "application/json"
  });

  req.type("json");
  req.send({
    "name": pizzaName
  });

  req.end(async function(res) {
    if (res.error) throw new Error(res.error);
    console.log(res.body);

    try {
      await taskService.complete(task);
      console.log("I completed my task successfully!!");
    } catch (e) {
      console.error(`Failed completing my task, ${e}`);
    }
  });
});

client.subscribe("echoService", async ({ task, taskService }) => {
  const variableA = task.variables.get("variableA");
  const variableB = task.variables.get("variableB");

  var req = unirest("POST", "https://www.putsreq.com/tYQr1JuRPp8xsVsRuv8u");

  req.headers({
    "Content-Type": "application/json"
  });

  req.type("json");
  req.send({
    variableA: variableA,
    variableB: variableB
  });

  req.end(async function(res) {
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