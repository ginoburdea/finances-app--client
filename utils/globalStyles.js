import { StyleSheet } from 'react-native'

export const colors = {
    primary: {
        highlightLight: '#1b1b1b',
        highlight: '#151515',
        borderFocused: '#bdbdbd',
        border: '#7a7a7a',
        background: '#0a0a0a',
        textDark: '#d1d1d1',
        text: '#e4e4e4',
    },
    accent: {
        regular: '#c5e32c',
        dark: '#b8d624',
    },
    danger: {
        regular: '#bd1a1a',
        focused: '#f11010',
    },
    success: {
        regular: '#48a73b',
        focused: '#328527',
    },
}

export const globalStyles = StyleSheet.create({
    titleLarge: {
        color: colors.primary.text,
        fontSize: 37.9,
        fontWeight: 'bold',
    },
    titleMedium: {
        color: colors.primary.text,
        fontSize: 28.43,
        fontWeight: 'bold',
    },
    titleSmall: {
        color: colors.primary.text,
        fontSize: 21.33,
        fontWeight: 'bold',
    },

    text: {
        color: colors.primary.text,
        fontSize: 16,
    },
    textSmall: {
        color: colors.primary.text,
        fontSize: 14,
    },

    link: {
        color: colors.accent.dark,
        textDecorationLine: 'underline',
    },
    error: {
        color: colors.danger.regular,
        fontWeight: 'bold',
    },
    success: {
        color: colors.success.regular,
        fontWeight: 'bold',
    },

    roundedSmall: {
        borderRadius: 8,
    },
    roundedMedium: {
        borderRadius: 16,
    },
})
