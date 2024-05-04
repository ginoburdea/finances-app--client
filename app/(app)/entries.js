import { Text } from 'react-native'
import { globalStyles } from '../../utils/globalStyles.js'
import { Link } from 'expo-router'

export default function Entries() {
    return (
        <>
            <Text style={globalStyles.titleLarge}>Entries</Text>
            <Link style={globalStyles.link} href="/add-entry">
                Add entry
            </Link>
        </>
    )
}
