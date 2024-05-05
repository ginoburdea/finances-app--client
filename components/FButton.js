import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors, globalStyles } from '../utils/globalStyles.js'
import PropTypes from 'prop-types'

export default function FButton({
    title,
    onPress,
    disabled = false,
    loading = false,
    fullWidth = false,
    transparent = false,
}) {
    return (
        <Pressable
            style={[
                globalStyles.roundedMedium,
                styles.button,
                fullWidth ? { width: '100%' } : {},
                disabled || loading ? styles.buttonDisabled : {},
                transparent ? {} : styles.regularButton,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
        >
            <Text
                style={[
                    globalStyles.text,
                    styles.label,
                    transparent ? globalStyles.link : {},
                ]}
            >
                {loading ? 'Loading...' : title}
            </Text>
        </Pressable>
    )
}

FButton.propTypes = {
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    fullWidth: PropTypes.bool,
    transparent: PropTypes.bool,
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 40,
        alignSelf: 'flex-start',
    },
    regularButton: {
        backgroundColor: colors.accent.regular,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    label: {
        textAlign: 'center',
        color: colors.primary.background,
        fontWeight: 'bold',
    },
})
