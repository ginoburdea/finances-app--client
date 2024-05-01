import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors, globalStyles } from '../utils/globalStyles.js'
import PropTypes from 'prop-types'

export default function FButton({
    title,
    onPress,
    disabled = false,
    loading = false,
    fullWidth = false,
}) {
    return (
        <Pressable
            style={[
                globalStyles.roundedMedium,
                styles.button,
                fullWidth ? { width: '100%' } : {},
            ]}
            onPress={onPress}
            disabled={disabled || loading}
        >
            <Text style={[globalStyles.text, styles.label]}>
                {loading ? 'Loading...' : title}
            </Text>
        </Pressable>
    )
}

FButton.propTypes = {
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    disabled: PropTypes.boolean,
    loading: PropTypes.boolean,
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 40,
        backgroundColor: colors.accent.regular,
        color: 'white',
        alignSelf: 'flex-start',
    },
    label: {
        textAlign: 'center',
        color: colors.primary.background,
        fontWeight: 'bold',
    },
})
