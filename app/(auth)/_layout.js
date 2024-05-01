import { ScrollView, StyleSheet, View } from 'react-native'
import { Slot } from 'expo-router'
import { colors } from '../../utils/globalStyles.js'

export default function AuthLayout() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.child}>
                <Slot />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary.background,
        minHeight: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    child: {
        width: '100%',
    },
})
