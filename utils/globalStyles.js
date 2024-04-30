import { StyleSheet } from 'react-native'

export const globalStyles = StyleSheet.create({
    titleLarge: {
        fontWeight: 'bold',
        fontSize: 29.3,
    },
    titleMedium: {
        fontWeight: 'bold',
        fontSize: 23.44,
    },
    titleSmall: {
        fontWeight: 'bold',
        fontSize: 18.75,
    },

    text: {
        fontSize: 15,
    },
    textSmall: {
        fontSize: 12,
    },

    link: {
        color: 'blue',
        textDecorationLine: 'underline',
        textDecorationColor: 'blue',
    },

    button: {
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 24,
        backgroundColor: 'grey',
        color: 'white',
        width: '20%',
    },
})

const colors = {
    primary: {
        highlight: '',
        borderDark: '',
        border: '',
        light: '',
        background: '',
        text: '',
    },
    accent: {
        regular: '',
        dark: '',
    },
}