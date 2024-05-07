import { storage } from './storage.js'

export const isLoggedIn = () => {
    const tokenExpiration = storage.getString('tokenExpiration')
    const token = storage.getString('token')

    if (!token || !tokenExpiration || new Date(tokenExpiration) < new Date()) {
        storage.delete('token')
        storage.delete('tokenExpiration')
        storage.delete('name')
        storage.delete('username')
        return false
    }

    return true
}
