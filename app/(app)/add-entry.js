import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import { useRouter } from 'expo-router'
import FInput from '../../components/FInput.js'
import { useEffect, useState } from 'react'
import { colors, globalStyles } from '../../utils/globalStyles.js'
import FButton from '../../components/FButton.js'
import { handleApolloErrors } from '../../utils/handleApolloErrors.js'
import { gql, useMutation } from '@apollo/client'
import dayjs from 'dayjs'
import DatePicker from 'react-native-date-picker'
import { useClickOutside } from 'react-native-click-outside'
import Categories from '../../components/Categories.js'

const ADD_ENTRY_MUTATION = gql`
    mutation($sum: Float!, $date: String!, $categoryId: ID!) {
        addEntry(
            addEntryInput: { sum: $sum, date: $date, categoryId: $categoryId }
        ) {
            _id
        }
    }
`

export default function AddEntry() {
    const [dateOpen, setDateOpen] = useState(false)
    const [categoriesOpen, setCategoriesOpen] = useState(false)
    const clickOutsideRef = useClickOutside(() => setCategoriesOpen(false))

    const [category, setCategory] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [categoryIdError, setCategoryIdError] = useState('')

    const [date, setDate] = useState(new Date())
    const [dateError, setDateError] = useState('')

    const [sum, setSum] = useState(0)
    const [sumError, setSumError] = useState('')

    const [addEntry, { loading, error: apolloError, data }] = useMutation(
        ADD_ENTRY_MUTATION
    )

    const [error, setError] = useState(null)

    const router = useRouter()

    useEffect(() => {
        if (!data) return

        router.push({
            pathname: '/entries',
            params: { highlightEntry: data._id },
        })
    }, [data])

    useEffect(() => {
        handleApolloErrors(apolloError, {
            categoryId: setCategoryIdError,
            date: setDateError,
            sum: setSumError,
            other: setError,
        })
    }, [apolloError])

    return (
        <>
            <Modal
                visible={categoriesOpen}
                onRequestClose={() => setCategoriesOpen(false)}
                transparent={true}
            >
                <View style={styles.categoriesContainer}>
                    <ScrollView
                        style={[globalStyles.roundedMedium, styles.categories]}
                        ref={clickOutsideRef}
                    >
                        <Text
                            style={[
                                globalStyles.titleMedium,
                                styles.categoriesTitle,
                            ]}
                        >
                            Category
                        </Text>

                        <Categories
                            onCategorySelect={(categoryId, categoryName) => {
                                setCategoriesOpen(false)
                                setCategoryId(categoryId)
                                setCategory(categoryName)
                                setCategoryIdError('')
                            }}
                        />
                    </ScrollView>
                </View>
            </Modal>

            <Text style={[globalStyles.titleLarge, styles.marginBottom]}>
                Add entry
            </Text>

            <View style={styles.marginBottom}>
                <DatePicker
                    mode="date"
                    modal={true}
                    open={dateOpen}
                    date={date}
                    onConfirm={date => {
                        setDateOpen(false)
                        setDate(date)
                    }}
                    onCancel={() => {
                        setDateOpen(false)
                    }}
                />

                <Pressable onPress={() => setCategoriesOpen(true)}>
                    <FInput
                        label="Category"
                        value={category}
                        onChange={() => {}}
                        error={categoryIdError}
                        onErrorChange={setCategoryIdError}
                        disabled
                    />
                </Pressable>

                <Pressable onPress={() => setDateOpen(true)}>
                    <FInput
                        label="Date"
                        value={dayjs(date).format('DD/MM/YYYY')}
                        onChange={setDate}
                        error={dateError}
                        onErrorChange={setDateError}
                        disabled
                    />
                </Pressable>

                <FInput
                    label="Sum"
                    value={sum}
                    onChange={value => setSum(+value)}
                    error={sumError}
                    onErrorChange={setSumError}
                    numeric
                />

                <FButton
                    onPress={() =>
                        addEntry({ variables: { categoryId, date, sum } })
                    }
                    title="Add entry"
                    loading={loading}
                />
            </View>

            {error && <Text style={[globalStyles.error]}>{error}</Text>}
        </>
    )
}

const styles = StyleSheet.create({
    marginBottom: {
        marginBottom: 20,
    },
    categoriesContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    categories: {
        backgroundColor: colors.primary.highlight,
        maxHeight: '70%',
        flexGrow: 0,
    },
    categoriesTitle: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
})
