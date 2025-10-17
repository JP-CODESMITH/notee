import { Stack } from "expo-router";

import React, { Component } from 'react'
import { Text, View } from 'react-native'

class componentName extends Component {
  render() {
    return (
      <Stack>
         <Stack.Screen name="[id]" options={{ headerShown: false }} />
      </Stack>
    )
  }
}

export default componentName