import React from 'react'

function CopyButton(props:{user}) {
    const [isClicked, setIsClicked] = React.useState(false)
  return (
    <a className="btn btn-secondary" 
        onClick={async () => {
            navigator.clipboard.writeText(props.user.phone_number)
            if(await navigator.clipboard.readText() === props.user.phone_number.toString()) {
                setIsClicked(true)
                console.log("Successfully copied!")
            }
        }}
    >
        {isClicked ? 'Copied' : 'Copy'}
    </a>
  )
}

export default CopyButton
