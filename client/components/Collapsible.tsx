import React, { useState, FC, ReactNode } from 'react'
import styled from "styled-components"

interface CollapsibleProps {
  children: ReactNode
  ariaControls: string
}

export function Collapsible ({ children, ariaControls } : CollapsibleProps) {
  const [show, setShow] = useState(false);

  function flipShow () {
    setShow((previous) => !previous);
  }

  const HoverableTextButton = styled.button`
    padding-top: 0;
    padding-bottom: 0;
    border: 0;
    transition: all 0.1s linear;
    &:hover {
      color: red;
    }
  `;  // Warning, counts as a React use hook 🤷‍♂️


  let summary : ReactNode, details: ReactNode;
  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) return;

    if (child.type === Collapsible.Summary) {
      summary = child.props.children;
    }

    if (child.type === Collapsible.Details) {
      details = child.props.children;
    }
  });

  return <>
           <HoverableTextButton
             className={`collapse-title ${show ? '' : 'collapsed'}`}
             type="button" onClick={flipShow}
             aria-expanded="false"
             aria-controls={ariaControls}>
           { summary }
           </HoverableTextButton>
           <svg className="icon" aria-hidden="true" style={{
             color: 'red',
             width: '12px',
             transform: show ? "rotate(180deg)" : "rotate(0)",
             transition: "all 0.2s linear" }}
             onClick={flipShow}>
             <use xlinkHref="#icon-triangle"></use>
           </svg>
           <div className={`collapse ${show ? 'show' : ''}`}>
             { details }
           </div>
  </>;
}

interface SubcomponentProps {
  children?: React.ReactNode;
}

Collapsible.Summary = ((_props) => {
  throw new Error("Please don't use Collapsible.Summary outside of Collapsible")
}) as FC<SubcomponentProps>;

Collapsible.Details = ((_props) => {
  throw new Error("Please don't use Collapsible.Details outside of Collapsible")
}) as FC<SubcomponentProps>;
