import React from 'react'

export const Logo = () => {
  return (
    <img
      src='/logo.png'
      alt='GeziBank'
      width={238}
      height={52}
      style={{
        objectFit: 'contain',
        maxWidth: '100%',
        height: 'auto',
      }}
    />
  )
}