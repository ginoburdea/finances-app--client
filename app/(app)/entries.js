import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import { colors, globalStyles } from '../../utils/globalStyles.js'
import { Link } from 'expo-router'
import DatePicker from 'react-native-date-picker'
import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import CategoriesModal from '../../components/CatgegoriesModal.js'
import { NetworkStatus, gql, useQuery } from '@apollo/client'
import { UNKNOWN_ERROR_NO_INFO } from '../../utils/errors.js'
import FButton from '../../components/FButton.js'

const GET_ENTRIES_QUERY = gql`
    query($date: String!, $page: Int!, $categoryId: ID) {
        entries(
            getEntriesInput: {
                date: $date
                page: $page
                categoryId: $categoryId
            }
        ) {
            sum
            isIncome
            category {
                name
            }
        }
    }
`

export default function Entries() {
    const [dateOpen, setDateOpen] = useState(false)
    const [category, setCategory] = useState('')
    const [categoryId, setCategoryId] = useState(null)
    const [date, setDate] = useState(new Date())
    const [categoriesOpen, setCategoriesOpen] = useState(false)

    const [lastPage, setLastPage] = useState(0)

    const {
        data,
        error: apolloError,
        refetch,
        loading,
        networkStatus,
    } = useQuery(GET_ENTRIES_QUERY, {
        variables: { date, categoryId: undefined, page: 0 },
        notifyOnNetworkStatusChange: true,
    })

    const [error, setError] = useState('')

    const [entries, setEntries] = useState([])

    const [showLoadMode, setShowLoadMore] = useState(true)

    useEffect(() => {
        setEntries([])
        setLastPage(-1)
        setShowLoadMore(true)

        refetch({
            page: 0,
            categoryId: categoryId || undefined,
            date,
        })
    }, [categoryId, date])

    useEffect(() => {
        if (!data) return

        setLastPage(lastPage + 1)
        if (data.entries.length > 0) setEntries([...entries, ...data.entries])
        if (data.entries.length < 25) setShowLoadMore(false)
    }, [data])

    useEffect(() => {
        setError(apolloError ? UNKNOWN_ERROR_NO_INFO : null)
    }, [apolloError])

    const isLoading = useMemo(
        () => loading || networkStatus === NetworkStatus.refetch,
        [loading, networkStatus]
    )

    const loadMore = async () => {
        await refetch({
            page: lastPage + 1,
            categoryId: categoryId || undefined,
            date,
        })
        setLastPage(lastPage + 1)
    }

    return (
        <>
            <View style={[styles.flexBetweenCenter, styles.marginBottomSmall]}>
                <Text style={globalStyles.titleLarge}>Entries</Text>

                <Link style={styles.iconContainer} href="/add-entry">
                    <View>
                        <Image
                            style={styles.icon}
                            source={require('../../assets/plus.png')}
                        />
                    </View>
                </Link>
            </View>

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

            <CategoriesModal
                open={categoriesOpen}
                onChangeOpen={setCategoriesOpen}
                onCategorySelect={(categoryId, categoryName) => {
                    setCategoryId(categoryId)
                    setCategory(categoryName)
                }}
            />

            <ScrollView horizontal contentContainerStyle={styles.marginBottom}>
                <Pressable
                    style={[styles.pill, styles.highlightedPill]}
                    onPress={() => setDateOpen(true)}
                >
                    <Text style={globalStyles.textSmall}>
                        Date: {dayjs(date).format('DD/MM/YYYY')}
                    </Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.flexBetweenCenter,
                        styles.pill,
                        category ? styles.highlightedPill : {},
                    ]}
                    onPress={() => setCategoriesOpen(true)}
                >
                    {category ? (
                        <>
                            <Text style={globalStyles.textSmall}>
                                Category: {category}
                            </Text>
                            <Pressable
                                onPress={() => {
                                    setCategory(null)
                                    setCategoryId(null)
                                }}
                            >
                                <Image
                                    style={styles.pillIcon}
                                    source={require('../../assets/close-menu.png')}
                                />
                            </Pressable>
                        </>
                    ) : (
                        <>
                            <Image
                                style={styles.pillIcon}
                                source={require('../../assets/plus.png')}
                            />
                            <Text style={globalStyles.textSmall}>
                                Add category
                            </Text>
                        </>
                    )}
                </Pressable>
            </ScrollView>

            {entries.length > 0 &&
                entries.map(entry => (
                    <View
                        key={entry._id}
                        style={[styles.flexBetweenCenter, styles.entry]}
                    >
                        <View>
                            <Text style={globalStyles.titleSmall}>
                                {entry.category.name}
                            </Text>
                            <Text style={globalStyles.text}>
                                {dayjs(date).format('D MMM YYYY')}
                            </Text>
                        </View>
                        <Text
                            style={[
                                globalStyles.text,
                                entry.isIncome
                                    ? globalStyles.success
                                    : globalStyles.error,
                            ]}
                        >
                            {entry.isIncome ? '+' : '-'}
                            {entry.sum}
                        </Text>
                    </View>
                ))}

            {error && <Text style={globalStyles.error}>{error}</Text>}

            {!isLoading && !error && entries.length === 0 && (
                <Text style={[globalStyles.text, styles.textCenter]}>
                    No entires found
                </Text>
            )}

            {!isLoading && !error && showLoadMode && (
                <FButton
                    title="Load more"
                    onPress={loadMore}
                    transparent
                    fullWidth
                />
            )}

            {isLoading && (
                <FButton
                    title="Loading..."
                    onPress={loadMore}
                    transparent
                    fullWidth
                    disabled
                />
            )}
        </>
    )
}

const styles = StyleSheet.create({
    flexBetweenCenter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    marginBottom: {
        marginBottom: 30,
    },
    marginBottomSmall: {
        marginBottom: 10,
    },
    iconContainer: {
        padding: 4,
        paddingRight: 0,
    },
    icon: {
        height: 20,
        width: 20,
    },
    pill: {
        ...globalStyles.roundedSmall,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: colors.primary.border,
        marginRight: 8,
        borderStyle: 'dashed',
        gap: 8,
    },
    highlightedPill: {
        borderStyle: 'solid',
    },
    pillIcon: {
        width: 10,
        height: 10,
        backgroundColor: colors.primary.highlight,
    },
    entry: {
        ...globalStyles.roundedMedium,
        backgroundColor: colors.primary.highlightLight,
        padding: 20,
        marginBottom: 10,
    },
    textCenter: {
        textAlign: 'center',
    },
})
