import { assign } from 'xstate/lib/actions'

const upload = (context, event) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const file = context.file !== null ? context.file : event.data.file
      if (file.name === 'success.pdf') {
        resolve({ fileName: file.name })
      } else {
        reject({ error: 'Upload failed', file: file })
      }
    }, 3000)
  })

const config = {
  id: 'fileMachine',
  initial: 'idle',
  context: {
    error: '',
    file: null,
    fileName: '',
  },
  states: {
    idle: {
      on: { INPUT: 'loading' },
      onEntry: assign({ error: '', file: null, fileName: '' }),
    },
    loading: {
      on: {
        CANCEL: 'idle',
      },
      invoke: {
        id: 'upload',
        src: upload,
        onDone: {
          target: 'complete',
          actions: assign({
            fileName: (context, event) => event.data.fileName,
          }),
        },
        onError: {
          target: 'failure',
          actions: assign((context, event) => ({
            error: event.data.error,
            file: event.data.error,
          })),
        },
      },
    },
    failure: {
      on: {
        CANCEL: 'idle',
        RETRY: 'loading',
      },
    },
    complete: {
      on: {
        CANCEL: 'idle',
      },
    },
  },
}

export default config
