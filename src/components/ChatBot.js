import React, { Component } from 'react'
import { AmplifyChatbot } from '@aws-amplify/ui-react/legacy'
import Amplify from 'aws-amplify'

Amplify.configure({
  aws_project_region: 'us-east-1',
  Auth: {
    identityPoolId: 'us-east-1:f2220f75-da92-4f98-8126-fa44b8d42f3b',
    region: 'us-east-1',
  },
  bots: {
    BookTrip_dev: {
      name: 'BookTrip_dev',
      alias: '$LATEST',
      region: 'us-east-1',
    },
  },
})

const ChatBot = () => {
  var msg
  if (!localStorage.getItem('userId')) {
    msg = 'Hi! How can I help you?'
  } else {
    msg = 'Hi ' + localStorage.getItem('userId') + '! How can I help you?'
  }
  return (
    <div>
      <AmplifyChatbot
        title='ServerlessBB'
        botName='BookTrip_dev'
        welcomeMessage={msg}
      />
    </div>
  )
}

export default ChatBot
