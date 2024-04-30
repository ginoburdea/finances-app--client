import { Text, View, Button, StyleSheet } from 'react-native'
import { Link } from 'expo-router'
import FInput from '../../components/FInput.js'
import { useEffect, useState } from 'react'
import { globalStyles } from '../../utils/globalStyles.js'
import { gql, useMutation } from '@apollo/client'
import { apolloClient } from '../../utils/apolloClient.js'

const LOGIN_MUTATION = gql`
    mutation {
        login(loginInput: { username: $username, password: $password }) {
            session {
                token
                expiresAt
            }
            user {
                name
            }
        }
    }
`

export default function Homepage() {
    const [username, setUsername] = useState('')
    const [usernameError, setUsernameError] = useState('')

    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const [logIn, { loading, error, data }] = useMutation(LOGIN_MUTATION, {
        client: apolloClient,
    })

    useEffect(() => console.log(error), [error])
    useEffect(() => console.log(data), [data])

    return (
        <>
            <View style={styles.marginBottom}>
                <Text style={globalStyles.titleLarge}>Welcome back!</Text>
                <Text style={globalStyles.text}>
                    Use the form below to log in or{' '}
                    <Link href="/register" style={globalStyles.link}>
                        click here to register
                    </Link>
                </Text>
            </View>

            <View style={styles.marginBottom}>
                <FInput
                    label="Username"
                    value={username}
                    onChange={setUsername}
                    error={usernameError}
                    onErrorChange={setUsernameError}
                />
                <FInput
                    label="Password"
                    value={password}
                    onChange={setPassword}
                    error={passwordError}
                    onErrorChange={setPasswordError}
                    hideInput={true}
                />
                <Button
                    style={globalStyles.button}
                    onPress={() => logIn({ variables: { username, password } })}
                    title={loading ? 'Loading...' : 'Log in'}
                    disabled={loading}
                />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    marginBottom: {
        marginBottom: 20,
    },
})
