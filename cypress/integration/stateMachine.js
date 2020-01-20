import { getSimplePaths } from '@xstate/graph'
import { Machine } from 'xstate'
import machineConfig from '../../src/machineConfig'

Cypress.Commands.add('send', (transition, data) =>
  cy.window().invoke('sendTransition', transition, data)
)

const mockSuccessUploadData = {
  data: { fileName: 'success.pdf' },
}

const mockFailureUploadData = {
  data: {
    error: 'Upload failed',
    file: {
      fileName: 'failure.pdf',
    },
  },
}

const mockInvokedServiceEvents = {
  events: {
    INPUT: [{ type: 'INPUT', data: { file: { name: 'success.pdf' } } }],
    'done.invoke.upload': [
      { type: 'done.invoke.upload', ...mockSuccessUploadData },
    ],
    'error.platform.upload': [
      { type: 'done.invoke.upload', ...mockFailureUploadData },
    ],
  },
}

describe('File upload state machine', function() {
  before(() => {
    cy.visit('/')
  })

  const machine = Machine(machineConfig)
  const simplePaths = getSimplePaths(machine, { ...mockInvokedServiceEvents })
  console.log(simplePaths)

  Object.keys(simplePaths).forEach(simplePath => {
    const { paths } = simplePaths[simplePath]

    paths.forEach(({ segments: path, state }) => {
      const eventString = path.length
        ? 'via ' + path.map(step => step.event.type).join(', ')
        : ''
      const transitions = path.map(step => step.event)

      it(`reaches ${state.value} ${eventString}`, () => {
        const selector = `[data-testid="${state.value}"]`
        transitions.forEach(transition => {
          cy.send(transition.type, transition.data)
        })
        cy.get(selector).should('exist')
      })
    })
  })
})
