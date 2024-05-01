import { View } from 'react-native'
import { Slot } from 'expo-router'

export default function AuthLayout() {
    return (
        <View
            style={{
                backgroundColor: '#fffff1',
                minHeight: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 5,
            }}
        >
            <View>
                <Slot />
            </View>
        </View>
    )
}
