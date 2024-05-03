import { StyleSheet, Text, View } from 'react-native'
import { globalStyles } from '../../utils/globalStyles.js'
import { storage } from '../../utils/storage.js'
import { useEffect, useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import DashboardCard from '../../components/DashboardCard.js'
import { UNKNOWN_ERROR_NO_INFO } from '../../utils/errors.js'

const mainCategoriesQuery = gql`
    query {
        categories(getCategoriesInput: { parent: null }) {
            _id
            name
        }
    }
`

export default function App() {
    const name = storage.getString('name')

    const { error, data } = useQuery(mainCategoriesQuery)

    useEffect(() => {
        if (!data) return

        setIncomeCategory(data.categories.find(cat => cat.name === 'Income'))
        setExpensesCategory(
            data.categories.find(cat => cat.name === 'Expenses')
        )
    }, [data])

    const [incomeCategory, setIncomeCategory] = useState(null)
    const [expensesCategory, setExpensesCategory] = useState(null)

    return (
        <>
            <View style={styles.marginBottom}>
                <Text style={globalStyles.titleLarge}>Hello, {name}</Text>
                <Text style={globalStyles.text}>
                    Here is an overview of your spending:
                </Text>
            </View>

            {error && (
                <Text style={globalStyles.error}>{UNKNOWN_ERROR_NO_INFO}</Text>
            )}

            {incomeCategory && (
                <DashboardCard
                    categoryId={incomeCategory._id}
                    categoryName={incomeCategory.name}
                />
            )}

            {expensesCategory && (
                <DashboardCard
                    categoryId={expensesCategory._id}
                    categoryName={expensesCategory.name}
                />
            )}
        </>
    )
}

const styles = StyleSheet.create({
    marginBottom: {
        marginBottom: 20,
    },
})
