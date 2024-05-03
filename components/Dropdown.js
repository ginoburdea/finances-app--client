import PropTypes from 'prop-types'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { colors, globalStyles } from '../utils/globalStyles.js'
import { useState } from 'react'
import { useClickOutside } from 'react-native-click-outside'

/**
 * @param {{options: {value: any, label: string}[], onChange: () => any, value: any}} param0
 * @returns
 */
export default function Dropdown({ options, onChange, value }) {
    const [isOpen, setIsOpen] = useState(false)
    const clickOutsideRef = useClickOutside(() => setIsOpen(false))

    return (
        <>
            <Pressable
                style={styles.selectedContainer}
                onPress={isOpen ? () => {} : () => setIsOpen(true)}
            >
                <Text style={[globalStyles.textSmall, styles.selectedTitle]}>
                    {options.find(opt => opt.value === value).label}
                </Text>
                <Image
                    style={[styles.icon, isOpen ? styles.rotate180 : {}]}
                    source={require('../assets/arrow-down.png')}
                />
            </Pressable>
            {isOpen && (
                <View style={styles.options} ref={clickOutsideRef}>
                    {options.map(option => (
                        <Pressable
                            onPress={() => {
                                onChange(option.value)
                                setIsOpen(false)
                            }}
                            style={styles.option}
                            key={option.value}
                        >
                            <Text style={globalStyles.textSmall}>
                                {option.label}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            )}
        </>
    )
}

Dropdown.propTypes = {
    value: PropTypes.any.isRequired,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
    selectedContainer: {
        display: 'flex',
        gap: 10,
        alignItems: 'baseline',
        flexDirection: 'row',
    },
    selectedTitle: {
        color: colors.primary.textDark,
    },
    icon: {
        height: 10,
        width: 10,
    },
    rotate180: {
        transform: [{ rotate: '180deg' }],
    },
    options: {
        ...globalStyles.roundedSmall,
        backgroundColor: colors.primary.highlightLight,
        position: 'absolute',
        top: 40,
        right: 0,
        zIndex: 100,
    },
    option: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
})
