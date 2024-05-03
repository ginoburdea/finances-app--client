import { ApolloProvider } from '@apollo/client'
import { Slot } from 'expo-router'
import { apolloClient } from '../utils/apolloClient.js'

export function RootLayout() {
    return (
        <ApolloProvider client={apolloClient}>
            <Slot />
        </ApolloProvider>
    )
}
