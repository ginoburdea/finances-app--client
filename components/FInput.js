import { StyleSheet, Text, TextInput, View } from 'react-native'
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
    numeric = false,
}) {
    const [isFocused, setIsFocused] = useState(false)

    return (
        <View style={styles.container}>
            <Text style={[globalStyles.textSmall, styles.label]}>{label}</Text>
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
    inputFocused: {
        borderColor: colors.primary.borderFocused,
    },
    inputError: {
        borderColor: colors.danger.regular,
    },
    inputErrorFocused: {
        borderColor: colors.danger.focused,
    },
})
