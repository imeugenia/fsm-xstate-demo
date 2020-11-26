const upload = (context, event) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ fileName: 'dummy.pdf' })

      //   const file = new File([''], 'dummy.pdf')
      //   reject({ error: 'Upload failed', file: file })
    }, 3000)
  })

const fileUploadMachine = Machine({
  id: 'fileMachine',
  initial: 'idle',
  context: {
    error: '',
    file: '',
    fileName: '',
  },
  states: {
    idle: {
      on: { INPUT: 'loading' },
      onEntry: assign({ error: '', file: '', fileName: '' }),
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
})
