  const {
    Client,
    logger,
    Variables
  } = require("camunda-external-task-client-js");
  const unirest = require("unirest");
  const express = require('express')
  const path = require('path')
  const PORT = process.env.PORT || 5000

  express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
.listen(PORT, () => console.log(`Listening on ${ PORT }`))
  
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