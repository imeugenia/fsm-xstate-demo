import React from 'react'
import icon from './icon.svg'

const AttachmentLoading = props => {
  return (
    <div className='Attachment' data-testid='loading'>
      <span>Loading...</span>
      <button type='button' onClick={props.onCancel}>
        X
      </button>
    </div>
  )
}

const AttachmentFailure = props => {
  return (
    <div className='Attachment' data-testid='failure'>
      <div className='Retry' onClick={props.onRetry}>
        <span className='Error'>{props.error}</span>
        <span>Click to retry</span>
      </div>
      <button type='button' onClick={props.onCancel}>
        X
      </button>
    </div>
  )
}

const AttachmentComplete = props => {
  return (
    <div className='Attachment' data-testid='complete'>
      <img className='Icon' src={icon} alt=''/>
      <div>{props.fileName}</div>
      <button type='button' onClick={props.onCancel}>
        X
      </button>
    </div>
  )
}

export default {
  Loading: AttachmentLoading,
  Failure: AttachmentFailure,
  Complete: AttachmentComplete,
}
