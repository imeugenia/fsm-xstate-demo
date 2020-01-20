import React from 'react'

const FileInput = props => {
  return (
    <React.Fragment>
      <input
        className='Input-File'
        type='file'
        name='attachment'
        id='attachment'
        onChange={props.handleChange}
        disabled={props.disabled}
        data-testid={props.state.matches('idle') ? 'idle' : undefined}
      />
      <label htmlFor='attachment'>Add attachment</label>
    </React.Fragment>
  )
}

export default FileInput
