import { Link } from 'expo-router'
import { Text } from 'react-native'
import { globalStyles } from '../../utils/globalStyles.js'

export default function App() {
    return (
        <>
            <Text>Dashboard</Text>
            <Text>
                <Link style={globalStyles.link} href="/register">
                    Register page
                </Link>
            </Text>
            <Text>
                <Link style={globalStyles.link} href="/">
                    Login page
                </Link>
            </Text>
        </>
    )
}
