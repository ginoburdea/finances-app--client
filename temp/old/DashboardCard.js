import { NetworkStatus, gql, useQuery } from '@apollo/client'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import PropTypes from 'prop-types'
import { colors, globalStyles } from '../utils/globalStyles.js'
import { useEffect, useMemo, useState } from 'react'
import Dropdown from './Dropdown.js'
import { UNKNOWN_ERROR_NO_INFO } from '../utils/errors.js'
import { LineChart } from 'react-native-chart-kit'
import dayjs from 'dayjs'
import dayjsUtcPlugin from 'dayjs/plugin/utc'

dayjs.extend(dayjsUtcPlugin)

const query = gql`
    query($categoryId: ID!, $preset: DailyTotalsPreset!) {
        entryTotals(
            entryTotalsInput: { categoryId: $categoryId, preset: $preset }
        ) {
            date
            sum
            category {
                _id
                name
            }
        }
    }
`

const genColorFn = color => (opacity = 1) =>
    color + (opacity == 1 ? 'ff' : opacity * 100)

const customDotRenderFn = ({ x, y, index, indexData }) => (
    <View
        style={{
            position: 'absolute',
            top: y - 25,
            left: x - 8,
        }}
    >
        <Text style={[globalStyles.textSmall]}>{indexData}</Text>
    </View>
)

const getCategoryStates = (categories, initialTimeFrame) => {
    // const [states, setStates] = useState([])
    const states = []
    for (const { id, name } of categories) {
        // if (!id || !name) continue

        console.log({ id, name })
        const { loading, data, error, networkStatus, refetch } = useQuery(
            query,
            {
                variables: { categoryId: id, preset: initialTimeFrame },
                notifyOnNetworkStatusChange: true,
            }
        )

        const newState = {
            id,
            name,
            loading,
            data,
            error,
            networkStatus,
            refetch,
        }
        // setStates([...states, newState])
        states.push(newState)
        // states.push({
        //     id,
        //     name,
        //     loading,
        //     data,
        //     error,
        //     networkStatus,
        //     refetch,
        // })
    }
    return states
}

// const LoadCategoryData = ({ id, name, timeFrame, onState }) => {
//     // if (!id || !name) continue

//     console.log({ id, name })
//     const { loading, data, error, networkStatus, refetch } = useQuery(query, {
//         variables: { categoryId: id, preset: timeFrame },
//         notifyOnNetworkStatusChange: true,
//     })

//     const newState = {
//         id,
//         name,
//         loading,
//         data,
//         error,
//         networkStatus,
//         refetch,
//     }
//     onState(newState)

//     return null
// }

export default function DashboardCard({
    // categoryId1,
    // categoryName1,
    // categoryId2 = null,
    // categoryName2 = null,
    // categoryId3 = null,
    // categoryName3 = null,
    categories = [],
}) {
    // export default function DashboardCard({ categoryId, categoryName }) {
    const timeFrameOptions = [
        { label: 'Last 7 days', value: 'LAST_7_DAYS' },
        { label: 'Last 30 days', value: 'LAST_30_DAYS' },
    ]
    const [timeFrame, setTimeFrame] = useState(timeFrameOptions[0].value)

    // const { loading, data, error, networkStatus, refetch } = useQuery(query, {
    //     variables: { categoryId, preset: timeFrame },
    //     notifyOnNetworkStatusChange: true,
    // })

    // const [states, setStates] = useState([])
    // for (const { id, name } of categories) {
    //     const { loading, data, error, networkStatus, refetch } = useQuery(
    //         query,
    //         {
    //             variables: { categoryId: id, preset: timeFrame },
    //             notifyOnNetworkStatusChange: true,
    //         }
    //     )

    //     const newState = {
    //         id,
    //         name,
    //         loading,
    //         data,
    //         error,
    //         networkStatus,
    //         refetch,
    //     }
    //     setStates([...states, newState])
    //     // states.push({
    //     //     id,
    //     //     name,
    //     //     loading,
    //     //     data,
    //     //     error,
    //     //     networkStatus,
    //     //     refetch,
    //     // })
    // }

    const [states, setStates] = useState([])

    useEffect(() => {
        const _states = getCategoryStates(categories, timeFrame)
        setStates()
    }, [categories])

    // const states = useCategoryStates(categories, timeFrame)

    // const states = useMemo(() => {
    //     const _states = []
    //     for (const { id, name } of categories) {
    //         // if (!id || !name) continue

    //         console.log({ id, name })
    //         const { loading, data, error, networkStatus, refetch } = useQuery(
    //             query,
    //             {
    //                 variables: { categoryId: id, preset: timeFrame },
    //                 notifyOnNetworkStatusChange: true,
    //             }
    //         )

    //         const newState = {
    //             id,
    //             name,
    //             loading,
    //             data,
    //             error,
    //             networkStatus,
    //             refetch,
    //         }
    //         // setStates([...states, newState])
    //         _states.push(newState)
    //         // states.push({
    //         //     id,
    //         //     name,
    //         //     loading,
    //         //     data,
    //         //     error,
    //         //     networkStatus,
    //         //     refetch,
    //         // })
    //     }
    //     return _states
    // }, [categories])

    // useEffect(() => {
    //     console.log(categories.length, states.length)
    // }, [states])

    // const {
    //     loading: loading1,
    //     data: data1,
    //     error: error1,
    //     networkStatus: networkStatus1,
    //     refetch: refetch1,
    // } = useQuery(query, {
    //     variables: { categoryId: categoryId1, preset: timeFrame },
    //     notifyOnNetworkStatusChange: true,
    // })

    // let [loading2, setLoading2] = useState(false)
    // let [data2, setData2] = useState(null)
    // let [error2, setError2] = useState(null)
    // let [networkStatus2, setNetworkStatus2] = useState(null)
    // let refetch2 = async () => {}

    // if (categoryId2) {
    //     const {
    //         loading: _loading2,
    //         data: _data2,
    //         error: _error2,
    //         networkStatus: _networkStatus2,
    //         refetch: _refetch2,
    //     } = useQuery(query, {
    //         variables: { categoryId: categoryId2, preset: timeFrame },
    //         notifyOnNetworkStatusChange: true,
    //     })

    //     refetch2 = _refetch2
    //     useEffect(() => setLoading2(_loading2), [_loading2])
    //     useEffect(() => setData2(_data2), [_data2])
    //     useEffect(() => setError2(_error2), [_error2])
    //     useEffect(() => setNetworkStatus2(_networkStatus2), [_networkStatus2])
    // }

    // let [loading3] = useState(false)
    // let [data3] = useState(null)
    // let [error3] = useState(null)
    // let [networkStatus3] = useState(null)
    // let refetch3 = async () => {}

    // if (categoryId2) {
    //     ;({
    //         loading: loading3,
    //         data: data3,
    //         error: error3,
    //         networkStatus: networkStatus3,
    //         refetch: refetch3,
    //     } = useQuery(query, {
    //         variables: { categoryId: categoryId3, preset: timeFrame },
    //         notifyOnNetworkStatusChange: true,
    //     }))
    // }
    // let [loading3, setLoading3] = useState(false)
    // let [data3, setData3] = useState(null)
    // let [error3, setError3] = useState(null)
    // let [networkStatus3, setNetworkStatus3] = useState(null)
    // let refetch3 = async () => {}

    // if (categoryId3) {
    //     const {
    //         loading: _loading3,
    //         data: _data3,
    //         error: _error3,
    //         networkStatus: _networkStatus3,
    //         refetch: _refetch3,
    //     } = useQuery(query, {
    //         variables: { categoryId: categoryId3, preset: timeFrame },
    //         notifyOnNetworkStatusChange: true,
    //     })

    //     refetch3 = _refetch3
    //     useEffect(() => setLoading3(_loading3), [_loading3])
    //     useEffect(() => setData3(_data3), [_data3])
    //     useEffect(() => setError3(_error3), [_error3])
    //     useEffect(() => setNetworkStatus3(_networkStatus3), [_networkStatus3])
    // }

    let [chartWidth, setChartWidth] = useState(0)
    let [chartHeight, setChartHeight] = useState(0)

    // useEffect(() => {
    //     refetch({ categoryId, preset: timeFrame })
    // }, [timeFrame])
    useEffect(() => {
        const run = async () => {
            const promises = []
            for (const { id, refetch } of states) {
                promises.push(refetch({ categoryId: id, preset: timeFrame }))
            }
            await Promise.all(promises)

            // if (categoryId1) {
            //     await refetch1({ categoryId: categoryId1, preset: timeFrame })
            // }
            // if (categoryId2) {
            //     await refetch2({ categoryId: categoryId2, preset: timeFrame })
            // }
            // if (categoryId3) {
            //     await refetch3({ categoryId: categoryId3, preset: timeFrame })
            // }
        }
        run()
    }, [timeFrame])

    // const dataHasNonEmptyEntries = useMemo(() => {
    //     if (!data?.entryTotals) return false

    //     for (let i = 0; i < data.entryTotals.length; i++) {
    //         if (data.entryTotals[i].sum > 0) {
    //             return true
    //         }
    //     }

    //     return false
    // }, [data])
    const dataHasNonEmptyEntries = useMemo(
        () => {
            // if (!data1?.entryTotals && !data2?.entryTotals && !data3?.entryTotals) {
            //     return false
            // }

            // for (let i = 0; i < (data1?.entryTotals || []).length; i++) {
            //     if (data1.entryTotals[i].sum > 0) {
            //         return true
            //     }
            // }
            // for (let i = 0; i < (data2?.entryTotals || []).length; i++) {
            //     if (data2.entryTotals[i].sum > 0) {
            //         return true
            //     }
            // }
            // for (let i = 0; i < (data3?.entryTotals || []).length; i++) {
            //     if (data3.entryTotals[i].sum > 0) {
            //         return true
            //     }
            // }

            for (const { data } of states) {
                // console.log(data)

                if (!Array.isArray(data?.entryTotals)) continue

                for (let i = 0; i < data.entryTotals.length; i++) {
                    if (data.entryTotals[i].sum > 0) {
                        return true
                    }
                }
            }

            // console.log('dataHasNonEmptyEntries')
            // console.log('timezone', dayjs.tz.guess())
            // console.log(
            //     (
            //         data1?.entryTotals ||
            //         data2?.entryTotals ||
            //         data3?.entryTotals ||
            //         []
            //     ).map(entry => dayjs(entry.date).tz().format('MMM D'))
            // )
            // console.log((data1?.entryTotals || []).map(entry => entry.sum))
            // console.log()

            return false
            // }, [data1, data2, data3])
        },
        states.map(state => state.data)
    )

    // const loading = useMemo(
    //     () =>
    //         loading1 ||
    //         loading2 ||
    //         loading3 ||
    //         networkStatus1 === NetworkStatus.refetch ||
    //         networkStatus2 === NetworkStatus.refetch ||
    //         networkStatus3 === NetworkStatus.refetch,
    //     [
    //         loading1,
    //         loading2,
    //         loading3,
    //         networkStatus1,
    //         networkStatus2,
    //         networkStatus3,
    //     ]
    // )
    const loading = useMemo(
        () => {
            for (const { loading, networkStatus } of states) {
                if (loading || networkStatus === NetworkStatus.refetch) {
                    return true
                }
            }
            return false
        },
        states.flatMap(state => [state.loading, state.networkStatus])
    )
    // const networkStatus = useMemo(() => networkStatus1, [networkStatus1])
    // const error = useMemo(() => error1, [error1])
    const error = useMemo(
        () => {
            for (const { error } of states) {
                if (error) {
                    console.error(error)
                    return error
                }
            }
            return null
        },
        states.map(state => state.error)
    )

    // useEffect(() => {
    //     if (error1) console.log(error1)
    //     if (error2) console.log(error2)
    //     if (error3) console.log(error3)
    // }, [error1, error2, error3])

    const genLabels = states => {
        // console.log(states)

        if (states.length === 0) return []
        // console.log('states not empty')

        const firstWithEntries = states.find(
            state => !!state?.data?.entryTotals
        )
        // console.log(
        //     'firstWithEntries',
        //     JSON.stringify(firstWithEntries, null, 4)
        // )

        // const timezone = dayjs.tz.guess()
        // console.log('timezone', timezone)

        const utcMinutesOffset = dayjs().utcOffset()

        return firstWithEntries.data.entryTotals.map(entryTotal => {
            return dayjs(entryTotal.date)
                .add(utcMinutesOffset, 'minutes')
                .format('D MMM')
        })
    }

    return (
        <View style={styles.marginBottom}>
            {/* {categories.map(category => (
                <LoadCategoryData
                    id={category.id}
                    name={category.name}
                    timeFrame={timeFrame}
                    onState={state => setStates([...states, state])}
                />
            ))} */}

            <View style={[styles.cardTitleContainer, styles.marginBottomSmall]}>
                {/* <Text style={[globalStyles.titleMedium]}>{categoryName}</Text> */}
                {/* <Text style={[globalStyles.titleMedium]}>{categoryName1}</Text> */}
                <Text style={[globalStyles.titleMedium]}>
                    {categories.length === 1 ? categories[0].name : 'Result'}
                </Text>
                <Dropdown
                    onChange={setTimeFrame}
                    value={timeFrame}
                    options={timeFrameOptions}
                />
            </View>
            <View
                // style={[styles.card, loading ? styles.cardLoading : {}]}
                style={[styles.card, loading ? styles.cardLoading : {}]}
                onLayout={({ nativeEvent }) => {
                    // console.log(
                    //     'height',
                    //     nativeEvent.layout.height,
                    //     typeof nativeEvent.layout.height
                    // )
                    // console.log(
                    //     'width',
                    //     nativeEvent.layout.width,
                    //     typeof nativeEvent.layout.width
                    // )

                    // console.log(
                    //     nativeEvent.layout.width,
                    //     typeof nativeEvent.layout.width
                    // )

                    setChartHeight(Math.floor(nativeEvent.layout.height))
                    setChartWidth(Math.floor(nativeEvent.layout.width))
                }}
            >
                {/* {(loading || networkStatus === NetworkStatus.refetch) && ( */}
                {loading && (
                    <View style={styles.center}>
                        <Text style={[styles.textDark, styles.textCenter]}>
                            Loading...
                        </Text>
                    </View>
                )}

                {error && (
                    <View style={styles.center}>
                        <Text style={[styles.textDark, styles.textCenter]}>
                            {UNKNOWN_ERROR_NO_INFO}
                        </Text>
                    </View>
                )}

                {!dataHasNonEmptyEntries && (
                    <View style={styles.center}>
                        <Text style={[styles.textDark, styles.textCenter]}>
                            No entries found. Add a few then return to see the
                            changes
                        </Text>
                    </View>
                )}

                {dataHasNonEmptyEntries && (
                    <ScrollView horizontal={true}>
                        <LineChart
                            data={{
                                // labels: data.entryTotals.map(entry =>
                                //     dayjs(entry.date).format('MMM D')
                                // ),
                                // datasets: [
                                //     {
                                //         data: data.entryTotals.map(
                                //             entry => entry.sum
                                //         ),
                                //     },
                                // ],
                                // labels: (
                                //     data1?.entryTotals ||
                                //     data2?.entryTotals ||
                                //     data3?.entryTotals ||
                                //     []
                                // ).map(entry =>
                                //     dayjs(entry.date).format('MMM D')
                                // ),
                                labels: genLabels(states),
                                datasets: states
                                    .map(state =>
                                        state?.data?.entryTotals
                                            ? {
                                                  data: state.data.entryTotals.map(
                                                      entry => entry.sum
                                                  ),
                                              }
                                            : null
                                    )
                                    .filter(item => item),
                                // [
                                //     data1?.entryTotals && {
                                //         data: (data1.entryTotals || []).map(
                                //             entry => entry.sum
                                //         ),
                                //         color: () => '#d83232',
                                //     },
                                //     data2?.entryTotals && {
                                //         data: (data2.entryTotals || []).map(
                                //             entry => entry.sum
                                //         ),
                                //         color: () => '#327ad8',
                                //     },
                                //     data3?.entryTotals && {
                                //         data: (data3.entryTotals || []).map(
                                //             entry => entry.sum
                                //         ),
                                //         color: () => '#66d832',
                                //     },
                                // ].filter(data => data),
                                // datasets: [
                                //     data1?.entryTotals && {
                                //         data: (data1.entryTotals || []).map(
                                //             entry => entry.sum
                                //         ),
                                //         color: () => '#d83232',
                                //     },
                                //     data2?.entryTotals && {
                                //         data: (data2.entryTotals || []).map(
                                //             entry => entry.sum
                                //         ),
                                //         color: () => '#327ad8',
                                //     },
                                //     data3?.entryTotals && {
                                //         data: (data3.entryTotals || []).map(
                                //             entry => entry.sum
                                //         ),
                                //         color: () => '#66d832',
                                //     },
                                // ].filter(data => data),
                            }}
                            verticalLabelRotation={-90}
                            xLabelsOffset={20}
                            width={
                                timeFrame === 'LAST_7_DAYS'
                                    ? chartWidth
                                    : chartWidth * 3.5
                            }
                            height={chartHeight}
                            fromZero={true}
                            showValuesOnTopOfBars={true}
                            style={styles.chart}
                            chartConfig={{
                                backgroundGradientFrom:
                                    colors.primary.highlight,
                                backgroundGradientTo: colors.primary.highlight,
                                color: genColorFn(colors.accent.regular),
                                labelColor: genColorFn(colors.primary.textDark),
                            }}
                            renderDotContent={customDotRenderFn}
                        />
                    </ScrollView>
                )}
            </View>
            {dataHasNonEmptyEntries && timeFrame === 'LAST_30_DAYS' && (
                <Text style={[globalStyles.textSmall, styles.helpText]}>
                    Tip: Scroll to the left to see all the data
                </Text>
            )}
        </View>
    )
}

DashboardCard.propTypes = {
    // categoryId: PropTypes.string.isRequired,
    // categoryName: PropTypes.string.isRequired,
    // categoryId1: PropTypes.string.isRequired,
    // categoryName1: PropTypes.string.isRequired,
    // categoryId2: PropTypes.string,
    // categoryName2: PropTypes.string,
    // categoryId3: PropTypes.string,
    // categoryName3: PropTypes.string,
    categories: PropTypes.array.isRequired,
}

const styles = StyleSheet.create({
    marginBottom: {
        marginBottom: 30,
    },
    marginBottomSmall: {
        marginBottom: 5,
    },
    card: {
        ...globalStyles.roundedMedium,
        backgroundColor: colors.primary.highlight,
        height: 350,
    },
    center: {
        color: colors.primary.highlight,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    textDark: {
        color: colors.primary.textDark,
    },
    textCenter: {
        textAlign: 'center',
    },
    cardTitleContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
    },
    chart: {
        borderRadius: 16,
        margin: 10,
    },
    helpText: {
        color: colors.primary.textDark,
        textAlign: 'center',
        marginTop: 10,
    },
})
