import React from "react";

function Chevron(props:{rotateChevron, setRotateChevron, handleRotate}) {

  const rotate = props.rotateChevron ? "rotate(180deg)" : "rotate(0)"

  return (
    <svg className="icon" aria-hidden="true" style={{ color: 'red', width: '12px', transform: rotate, transition: "all 0.2s linear" }} onClick={props.handleRotate}>
      <use xlinkHref="#icon-triangle"></use>
    </svg>
  );
}

export default Chevron;
