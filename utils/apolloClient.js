import { ApolloClient, InMemoryCache } from '@apollo/client'

export const apolloClient = new ApolloClient({
    uri: 'http://82.77.126.232:15482/graphql',
    cache: new InMemoryCache(),
})
