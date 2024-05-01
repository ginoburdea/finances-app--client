import { ApolloClient, InMemoryCache } from '@apollo/client'
import { GRAPHQL_SERVER_URL } from '@env'

export const apolloClient = new ApolloClient({
    uri: GRAPHQL_SERVER_URL,
    cache: new InMemoryCache(),
})
