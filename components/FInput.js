import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native'
import PropTypes from 'prop-types'
import { colors, globalStyles } from '../utils/globalStyles.js'
import { useState } from 'react'

export default function FInput({
    label,
    value,
    onChange,
    error = null,
    onErrorChange = () => {},
    hideInput = false,
    disabled = false,
    forceEnabledStyle = false,
    numeric = false,
    hasClearButton = false,
}) {
    const [isFocused, setIsFocused] = useState(false)

    const disabledStyle = forceEnabledStyle
        ? {}
        : disabled
        ? styles.disabled
        : {}

    return (
        <View style={styles.container}>
            <Text style={[globalStyles.textSmall, styles.label, disabledStyle]}>
                {label}
            </Text>

            <View>
                <TextInput
                    secureTextEntry={hideInput}
                    style={[
                        globalStyles.roundedSmall,
                        styles.input,
                        isFocused ? styles.inputFocused : {},
                        error
                            ? isFocused
                                ? styles.inputErrorFocused
                                : styles.inputError
                            : {},
                        disabledStyle,
                    ]}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    value={value}
                    editable={!disabled}
                    keyboardType={numeric ? 'numeric' : 'default'}
                    onChangeText={newValue => {
                        onChange(newValue)
                        onErrorChange('')
                    }}
                />
                {hasClearButton && value && (
                    <Pressable
                        style={styles.clearIconContainer}
                        onPress={() => onChange(numeric ? 0 : '')}
                    >
                        <Image
                            style={styles.clearIcon}
                            source={require('../assets/close-menu.png')}
                        />
                    </Pressable>
                )}
            </View>

            {error && (
                <Text style={[globalStyles.textSmall, globalStyles.error]}>
                    {error}
                </Text>
            )}
        </View>
    )
}

FInput.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    onErrorChange: PropTypes.func,
    hideInput: PropTypes.bool,
    disabled: PropTypes.bool,
    forceEnabledStyle: PropTypes.bool,
    hasClearButton: PropTypes.bool,
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        marginBottom: 5,
        color: colors.primary.textDark,
    },
    input: {
        borderColor: colors.primary.border,
        borderWidth: 2,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginBottom: 5,
        color: colors.primary.text,
    },
    disabled: {
        opacity: 0.7,
    },
    inputFocused: {
        borderColor: colors.primary.borderFocused,
    },
    inputError: {
        borderColor: colors.danger.regular,
    },
    inputErrorFocused: {
        borderColor: colors.danger.focused,
    },
    clearIconContainer: {
        padding: 8,
        position: 'absolute',
        top: 10,
        right: 4,
    },
    clearIcon: {
        opacity: 0.75,
        height: 12,
        width: 12,
    },
})
