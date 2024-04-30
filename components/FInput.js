import { StyleSheet, Text, TextInput, View } from 'react-native'
import PropTypes from 'prop-types'

export default function FInput({
    label,
    value,
    onChange,
    error = null,
    onErrorChange = () => {},
    hideInput = false,
}) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                secureTextEntry={hideInput}
                style={[styles.input, error ? styles.inputError : {}]}
                value={value}
                onChangeText={newValue => {
                    onChange(newValue)
                    onErrorChange('')
                }}
            />
            {error && <Text style={styles.error}>{error}</Text>}
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
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        marginBottom: 5,
    },
    input: {
        borderRadius: 2,
        borderColor: 'grey',
        borderWidth: 2,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginBottom: 5,
    },
    inputError: {
        borderColor: 'red',
    },
    error: {
        color: 'red',
        fontWeight: '600',
    },
})
