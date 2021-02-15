import React from 'react'
import Attachment from './Attachment'
import FileInput from './FileInput'

const fetch = file => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (file && file.name === 'success.pdf') {
        resolve()
      } else {
        reject('Upload failed')
      }
    }, 3000)
  })
}

const initialState = {
  status: 'idle',
  file: null,
  fileName: '',
  error: '',
}

function reducer(state, action) {
  const { event, data } = action

  switch (event) {
    case 'INPUT': {
      if (state.status === 'idle') {
        return {
          ...state,
          status: 'loading',
          file: data.file,
        }
      }

      return state
    }

    case 'FAILED': {
      if (state.status === 'loading') {
        return {
          ...state,
          status: 'failure',
          error: data.error,
        }
      }

      return state
    }

    case 'SUCCEED': {
      if (state.status === 'loading') {
        return {
          ...initialState,
          status: 'complete',
          fileName: data.fileName,
        }
      }

      return state
    }

    case 'RETRY': {
      if (state.status === 'failure') {
        return {
          ...state,
          status: 'loading',
          error: '',
        }
      }

      return state
    }

    case 'CANCEL': {
      if (state.status !== 'idle') {
        return {
          ...initialState,
        }
      }

      return state
    }

    default: {
      return state
    }
  }
}

const FileUpload = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  const handleChange = event => {
    const file = event.target.files[0]
    dispatch({ event: 'INPUT', data: { file } })
  }

  React.useEffect(() => {
    const upload = async file => {
      try {
        await fetch(file)
        const fileName = file.name
        dispatch({ event: 'SUCCEED', data: { fileName } })
      } catch (error) {
        dispatch({ event: 'FAILED', data: { error } })
      }
    }

    if (state.status === 'loading' && state.file) {
      upload(state.file)
    }
  }, [state.file, state.status])

  const renderAttachment = () => {
    switch (state.status) {
      case 'loading': {
        return (
          <Attachment.Loading onCancel={() => dispatch({ event: 'CANCEL' })} />
        )
      }
      case 'failure': {
        return (
          <Attachment.Failure
            error={state.error}
            onRetry={() => dispatch({ event: 'RETRY' })}
            onCancel={() => dispatch({ event: 'CANCEL' })}
          />
        )
      }
      case 'complete': {
        return (
          <Attachment.Complete
            fileName={state.fileName}
            onCancel={() => dispatch({ event: 'CANCEL' })}
          />
        )
      }
      default: {
        return null
      }
    }
  }

  return (
    <>
      {renderAttachment()}
      <FileInput
        disabled={state.status === 'loading'}
        handleChange={handleChange}
      />
    </>
  )
}

export default FileUpload
