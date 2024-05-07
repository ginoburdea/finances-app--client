import { Text, View } from 'react-native'
import { Link, useRouter, useLocalSearchParams } from 'expo-router'
import FInput from '../../components/FInput.js'
import { useEffect, useState } from 'react'
import { globalStyles } from '../../utils/globalStyles.js'
import { apolloClient } from '../../utils/apolloClient.js'
import FButton from '../../components/FButton.js'
import { handleApolloErrors } from '../../utils/handleApolloErrors.js'
import { handleAuthData } from '../../utils/handleAuhData.js'
import { gql, useMutation } from '@apollo/client'
import { authStyles } from '../../utils/authStyles.js'

const LOGIN_MUTATION = gql`
    mutation($username: String!, $password: String!) {
        login(loginInput: { username: $username, password: $password }) {
            session {
                token
                expiresAt
            }
            user {
                name
                username
            }
        }
    }
`

export default function Login() {
    const [username, setUsername] = useState('')
    const [usernameError, setUsernameError] = useState('')

    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const [
        logIn,
        { loading, error: apolloError, data },
    ] = useMutation(LOGIN_MUTATION, { client: apolloClient })

    const [error, setError] = useState(null)

    const router = useRouter()

    useEffect(() => {
        handleApolloErrors(apolloError, {
            username: setUsernameError,
            password: setPasswordError,
            other: setError,
        })
    }, [apolloError])

    useEffect(() => handleAuthData(data, router), [data])

    return (
        <>
            <View style={authStyles.marginBottom}>
                <Text
                    style={[
                        globalStyles.titleLarge,
                        authStyles.marginBottomSmall,
                    ]}
                >
                    Welcome back!
                </Text>
                <Text style={globalStyles.text}>
                    Use the form below to log in or{' '}
                    <Link href="/register" style={globalStyles.link}>
                        click here to register
                    </Link>
                </Text>
            </View>

            <View style={authStyles.marginBottom}>
                <FInput
                    label="Username"
                    value={username}
                    onChange={setUsername}
                    error={usernameError}
                    onErrorChange={setUsernameError}
                    disabled={loading}
                />
                <FInput
                    label="Password"
                    value={password}
                    onChange={setPassword}
                    error={passwordError}
                    onErrorChange={setPasswordError}
                    hideInput={true}
                    disabled={loading}
                />
                <FButton
                    onPress={() => logIn({ variables: { username, password } })}
                    title="Log in"
                    loading={loading}
                    fullWidth
                />
            </View>

            {error && (
                <Text style={[globalStyles.error, authStyles.errorMessage]}>
                    {error}
                </Text>
            )}
        </>
    )
}
