import React from 'react'
import './Title.css'

const Title = ({subTitle, title, scroll_id}) => {
  return (
    <div className='title' id={scroll_id}>
      <p>{subTitle.includes('?') ? (
          subTitle.split('?').map((segment, index) => (
            <React.Fragment key={index}>
              {segment}
              {index === 0 && '?'}
              {index < subTitle.split('?').length - 1 && <br />}
            </React.Fragment>
          ))
        ) : (
          subTitle
        )}</p>
      <h2>{title}</h2>
    </div>
  )
}
import './Title.css'

export default Title
