import { ScrollView, StyleSheet, View } from 'react-native'
import { Slot, router, usePathname, useRouter } from 'expo-router'
import { colors } from '../../utils/globalStyles.js'
import Header from '../../components/Header.js'
import { ClickOutsideProvider } from 'react-native-click-outside'
import { ApolloProvider } from '@apollo/client'
import { isLoggedIn } from '../../utils/isLoggedIn.js'
import { apolloClient } from '../../utils/apolloClient.js'
import { useEffect } from 'react'

export default function AppLayout() {
    const router = useRouter()

    const path = usePathname()
    useEffect(() => {
        if (!isLoggedIn()) {
            router.push('/login')
        }
    }, [path])

    return (
        <ApolloProvider client={apolloClient}>
            <ClickOutsideProvider>
                <Header />
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
