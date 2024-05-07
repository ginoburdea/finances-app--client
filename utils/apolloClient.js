import {
    ApolloClient,
    ApolloLink,
    HttpLink,
    InMemoryCache,
    from,
} from '@apollo/client'
import { GRAPHQL_SERVER_URL } from '@env'
import { onError } from '@apollo/client/link/error'
import { storage } from './storage.js'
import { router } from 'expo-router'

const attachAuthLink = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers }) => ({
        headers: {
            ...headers,
            authorization: 'Bearer ' + storage.getString('token'),
        },
    }))
    return forward(operation)
})

const handleUnauthenticatedLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors && graphQLErrors.length > 0) {
        if (graphQLErrors[0]?.extensions?.code === 'UNAUTHENTICATED') {
            router.push('/login')
        }
    }
})

const httpLink = new HttpLink({ uri: GRAPHQL_SERVER_URL })

export const apolloClient = new ApolloClient({
    link: from([attachAuthLink, handleUnauthenticatedLink, httpLink]),
    cache: new InMemoryCache(),
})
