import React from 'react'
import { useMachine } from 'use-machine'
import machineConfig from './machineConfig'
import Attachment from './Attachment'
import FileInput from './FileInput'

const FileUpload = () => {
  const { state, send, context } = useMachine(machineConfig)

  React.useEffect(() => {
    window.sendTransition = send
  }, [send])

  const renderAttachment = () => {
    switch (state.value) {
      case 'loading': {
        return <Attachment.Loading onCancel={() => send('CANCEL')} />
      }
      case 'failure': {
        return (
          <Attachment.Failure
            error={context.error}
            onCancel={() => send('CANCEL')}
            onRetry={() => send('RETRY')}
          />
        )
      }
      case 'complete': {
        return (
          <Attachment.Complete
            fileName={context.fileName}
            onCancel={() => send('CANCEL')}
          />
        )
      }

      default: {
        return null
      }
    }
  }

  const handleChange = event => {
    const file = event.target.files[0]
    send('INPUT', { data: { file } })
  }

  return (
    <div className='Wrapper'>
      {renderAttachment()}
      <FileInput
        disabled={state.matches('loading')}
        handleChange={handleChange}
        state={state}
      />
    </div>
  )
}

export default FileUpload
