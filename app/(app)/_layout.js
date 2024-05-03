import { ScrollView, StyleSheet, View } from 'react-native'
import { Redirect, Slot } from 'expo-router'
import { colors } from '../../utils/globalStyles.js'
import { ClickOutsideProvider } from 'react-native-click-outside'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { storage } from '../../utils/storage.js'
import { GRAPHQL_SERVER_URL } from '@env'

export default function AppLayout() {
    const tokenExpiration = storage.getString('tokenExpiration')
    const token = storage.getString('token')

    if (!token || !tokenExpiration || new Date(token) < new Date()) {
        storage.delete('tokenExpiration')
        storage.delete('token')
        return <Redirect href={'/'} />
    }

    const apolloClient = new ApolloClient({
        uri: GRAPHQL_SERVER_URL,
        cache: new InMemoryCache(),
        headers: {
            authorization: 'Bearer ' + storage.getString('token'),
        },
    })

    return (
        <ApolloProvider client={apolloClient}>
            <ClickOutsideProvider>
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.child}>
                        <Slot />
                    </View>
                </ScrollView>
            </ClickOutsideProvider>
        </ApolloProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary.background,
        minHeight: '100%',
    },
    child: {
        padding: 20,
    },
})
