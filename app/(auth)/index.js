import { Text, View, Button, StyleSheet } from 'react-native'
import { Link, router } from 'expo-router'
import FInput from '../../components/FInput.js'
import { useEffect, useState } from 'react'
import { globalStyles } from '../../utils/globalStyles.js'
import { ApolloError, gql, useMutation } from '@apollo/client'
import { apolloClient } from '../../utils/apolloClient.js'
import { storage } from '../../utils/storage.js'
import { UNKNOWN_ERROR } from '../../utils/errors.js'

const LOGIN_MUTATION = gql`
    mutation($username: String!, $password: String!) {
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

    const [
        logIn,
        { loading, error: apolloError, data },
    ] = useMutation(LOGIN_MUTATION, { client: apolloClient })

    const [error, setError] = useState(null)

    useEffect(() => {
        setError(null)
        setUsernameError(null)
        setPasswordError(null)
        if (!apolloError) return

        if (!(apolloError instanceof ApolloError)) {
            setError(UNKNOWN_ERROR)
            return
        }

        const validationPath = apolloError?.graphQLErrors?.at(0)?.path?.at(0)
        if (validationPath === 'username') {
            setUsernameError(apolloError.graphQLErrors[0].message)
            return
        }
        if (validationPath === 'password') {
            setPasswordError(apolloError.graphQLErrors[0].message)
            return
        }
        setError(UNKNOWN_ERROR)
    }, [apolloError])

    useEffect(() => {
        if (!data) return

        storage.set('token', data.login.session.token)
        storage.set('tokenExpiration', data.login.session.expiresAt)
        storage.set('name', data.login.user.name)
        storage.set('username', username)

        router.replace('/dashboard')
    }, [data])

    return (
        <>
            <View style={styles.marginBottom}>
                <Text
                    style={[globalStyles.titleLarge, styles.marginBottomSmall]}
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

            {error && (
                <Text
                    style={[
                        globalStyles.error,
                        styles.marginBottom,
                        styles.errorMessage,
                    ]}
                >
                    {error}
                </Text>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    marginBottom: {
        marginBottom: 20,
    },
    marginBottomSmall: {
        marginBottom: 5,
    },
    errorMessage: {
        textAlign: 'center',
    },
})
