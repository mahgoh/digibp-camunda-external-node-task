const CAMUNDA_REST_URL = process.env.CAMUNDA_REST_URL || 'https://digibp.herokuapp.com/engine-rest'

const { Client, logger, Variables } = require('camunda-external-task-client-js')

const client = new Client({
  baseUrl: CAMUNDA_REST_URL,
  use: logger,
  asyncResponseTimeout: 29000,
})

client.subscribe(
  'RequestPremium',
  {
    tenantIdIn: ['ENT5'],
  },
  async ({ task, taskService }) => {
    const customerId = task.variables.get('CustomerID')

    const estimatedPreminum = () => {
      let premium = Math.floor(Math.random() * (200 - 100) + 100)
      if (!customerId) premium *= 2
      return premium
    }

    const processVariables = new Variables().set('EstimatedPremium', estimatedPreminum())

    try {
      taskService.complete(task, processVariables)
      console.log('Premium was successfully estimated!!')
    } catch (e) {
      console.error(`Failed completing premium estimation`)
    }
  }
)

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
client.subscribe(
  'EvaluateRisk',
  {
    tenantIdIn: ['ENT5'],
  },
  async ({ task, taskService }) => {
    const claimAmount = task.variables.getTyped('ClaimAmount')

    // calculate risk
    let riskType = 'unknown'

    if (claimAmount.value < 100)
      riskType = Math.random() < 0.9 ? 'low' : 'unknown' // 10% chance of "unknown"
    else if (claimAmount.value < 500)
      riskType = Math.random() < 0.8 ? 'medium' : 'unknown' // 20% chance of "unknown"
    else riskType = Math.random() < 0.7 ? 'high' : 'unknown' // 30% chance of "unknown"

    // accept if "low" or "medium"
    // otherwise chance of acceptance is 50%
    const isAccepted = ['low', 'medium'].includes(riskType) || Math.random() < 0.5

    const processVariables = new Variables().set('RiskType', riskType).set('isAccepted', isAccepted)

    try {
      taskService.complete(task, processVariables)
      console.log('I completed my task successfully!!')
    } catch (e) {
      console.error(`Failed completing my task, ${e}`)
    }
  }
)

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
client.subscribe(
  'UpdatePolicyStatus',
  {
    tenantIdIn: ['ENT5'],
  },
  async ({ task, taskService }) => {
    const policyId = task.variables.getTyped('PolicyID')
    const toBeStatus = task.variables.getTyped('Status')

    const processVariables = new Variables().set('Status', toBeStatus)
    try {
      taskService.complete(task, processVariables)
      console.log('I completed my task successfully!!')
    } catch (e) {
      console.error(`Failed completing my task, ${e}`)
    }
  }
)

client.subscribe(
  'RequestPayment',
  {
    tenantIdIn: ['ENT5'],
  },
  async ({ task, taskService }) => {
    const invoiceNr = task.variables.get('InvoiceNr')

    const issueDate = new Date()
    const dueDate = new Date(issueDate.getDate() + 30)
    const inDefault = false
    const paymentReceived = false
    const reminderSent = false

    const processVariables = new Variables().setAll({
      IssueDate: issueDate,
      DueDate: dueDate,
      InDefault: inDefault,
      PaymentReceived: paymentReceived,
      ReminderSent: reminderSent,
    })
    try {
      taskService.complete(task, processVariables)
      console.log('I completed my task successfully!!')
    } catch (e) {
      console.error(`Failed completing my task, ${e}`)
    }
  }
)
