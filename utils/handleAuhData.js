import { storage } from './storage.js'

export const handleAuthData = (data, router) => {
    if (!data) return

    const fetchedData = data.login || data.register
    storage.set('token', fetchedData.session.token)
    storage.set('tokenExpiration', fetchedData.session.expiresAt)
    storage.set('name', fetchedData.user.name)
    storage.set('username', fetchedData.user.username)

    router.replace('/dashboard')
}
