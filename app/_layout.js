import { ApolloProvider } from '@apollo/client'
import { Slot } from 'expo-router'
import { apolloClient } from '../utils/apolloClient.js'
import { ScrollView, StyleSheet } from 'react-native'
import { colors } from '../utils/globalStyles.js'

export function RootLayout() {
    return (
        <ApolloProvider client={apolloClient}>
            {/* <ScrollView style={styles.root}> */}
                <Slot />
            {/* </ScrollView> */}
        </ApolloProvider>
    )
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: colors.primary.background,
    },
})
