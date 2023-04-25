import * as React from 'react'

import { Base } from '@epfl/epfl-sti-react-library'
import { OIDCContext, StateEnum, LoginButton, IfOIDCState, LoggedInUser } from '@epfl-si/react-appauth'


export default function Home() {
  return (
    <Base asideMenuItems={[]}>
      <OIDCContext authServerUrl = { 'http://localhost:8080/realms/react-starter-kit/' }
                      client = { { clientId: "react-starter-kit",
                                   redirectUri: "http://localhost:3000/" } }>
      <LoginButton inProgressLabel={ <>⏳</> }/>
      <IfOIDCState is={ StateEnum.LoggedIn }>
        <p>Hello, <LoggedInUser field="preferred_username" />!</p>
      </IfOIDCState>
    </OIDCContext>
    </Base>
  )
}
