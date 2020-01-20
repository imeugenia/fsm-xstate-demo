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

const FileUpload = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [file, setFile] = React.useState(null)
  const [error, setError] = React.useState('')

  const upload = async file => {
    try {
      await fetch(file)
    } catch (error) {
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = event => {
    setIsLoading(true)
    const file = event.target.files[0]
    setFile(file)
    upload(file)
  }

  const handleRetry = () => {
    upload(file)
  }

  const handleLoadingCancel = () => {
    setIsLoading(false)
    setFile(null)
  }

  const handleFailedCancel = () => {
    setError('')
    setFile(null)
  }

  const renderAttachment = () => {
    if (isLoading) {
      return <Attachment.Loading onCancel={handleLoadingCancel} />
    }
    if (error) {
      return (
        <Attachment.Failure
          error={error}
          onRetry={handleRetry}
          onCancel={handleFailedCancel}
        />
      )
    }
    if (file) {
      return (
        <Attachment.Complete
          fileName={file.name}
          onCancel={() => {
            setFile(null)
          }}
        />
      )
    }
    return null
  }

  return (
    <>
      {renderAttachment()}
      <FileInput disabled={isLoading} handleChange={handleChange} />
    </>
  )
}

export default FileUpload
