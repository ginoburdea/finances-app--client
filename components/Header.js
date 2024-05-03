import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { colors, globalStyles } from '../utils/globalStyles.js'
import { useState } from 'react'
import { useClickOutside } from 'react-native-click-outside'
import { Link } from 'expo-router'

const menuItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Entries', href: '/entries' },
    { label: 'Analytics', href: '/analytics' },
]

export default function Header() {
    const [isOpen, setIsOpen] = useState(false)
    const clickOutsideRef = useClickOutside(() => setIsOpen(false))

    return (
        <>
            <View style={styles.header}>
                <Text style={globalStyles.text}>Finances App</Text>
                <Pressable onPress={isOpen ? () => {} : () => setIsOpen(true)}>
                    <Image
                        style={styles.menuIcon}
                        source={
                            isOpen
                                ? require('../assets/close-menu.png')
                                : require('../assets/burger-menu.png')
                        }
                    />
                </Pressable>
            </View>
            {isOpen && (
                <View style={styles.dropdown} ref={clickOutsideRef}>
                    {menuItems.map(menu => (
                        <Link
                            style={[
                                globalStyles.text,
                                styles.dropdownItem,
                                styles.borderBottom,
                            ]}
                            href={menu.href}
                            key={menu.href}
                            onPress={() => setIsOpen(false)}
                        >
                            {menu.label}
                        </Link>
                    ))}
                </View>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: colors.primary.highlight,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    menuIcon: {
        height: 20,
        width: 20,
    },
    dropdown: {
        backgroundColor: colors.primary.highlightLight,
        zIndex: 100,
        position: 'absolute',
        top: 60,
        left: 0,
        width: '100%',
    },
    dropdownItem: {
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    borderBottom: {
        borderColor: colors.primary.highlight,
        borderBottomWidth: 1,
    },
})
