import { gql, useApolloClient } from '@apollo/client'
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

const GET_CATEGORIES_QUERY = gql`
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

const genColorFn = color => (opacity = 1) => {
    return color + (opacity == 1 ? 'ff' : opacity * 100)
}

const customDotRenderFn = ({ x, y, index, indexData }) => (
    <View
        style={{
            position: 'absolute',
            top: y - 25,
            left: x - 5,
        }}
    >
        <Text style={[globalStyles.textSmall]}>{indexData}</Text>
    </View>
)

const datasetColors = [() => '#35b867', () => '#c07127', () => '#277bc0']

/**
 * @param {{categories: {id: string, name: string}[]}} param0
 */
export default function DashboardCard({ categories = [] }) {
    const timeFrameOptions = [
        { label: 'Last 7 days', value: 'LAST_7_DAYS' },
        { label: 'Last 30 days', value: 'LAST_30_DAYS' },
    ]
    const [timeFrame, setTimeFrame] = useState(timeFrameOptions[0].value)

    const apolloClient = useApolloClient()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [labels, setLabels] = useState([])
    const [datasets, setDatasets] = useState([])
    const [dataHasNonEmptyEntries, setDataHasNonEmptyEntries] = useState(false)

    useEffect(() => {
        const run = async () => {
            setLoading(true)

            let datasets = []
            let labels = []
            let dataHasNonEmptyEntries = false

            try {
                for (const { id, name } of categories) {
                    const result = await apolloClient.query({
                        query: GET_CATEGORIES_QUERY,
                        variables: { categoryId: id, preset: timeFrame },
                    })

                    if (!result?.data?.entryTotals) {
                        throw new Error('no entryTotals')
                    }

                    if (labels.length === 0) {
                        const utcMinutesOffset = dayjs().utcOffset()

                        result.data.entryTotals.forEach(entryTotal => {
                            labels.push(
                                dayjs(entryTotal.date)
                                    .add(utcMinutesOffset, 'minutes')
                                    .format('D MMM')
                            )
                        })
                    }

                    if (!dataHasNonEmptyEntries) {
                        for (const { sum } of result.data.entryTotals) {
                            if (sum > 0) {
                                dataHasNonEmptyEntries = true
                            }
                        }
                    }

                    const color = datasetColors[datasets.length]

                    datasets.push({
                        name,
                        data: result.data.entryTotals.map(entry => entry.sum),
                        color,
                    })
                }

                setLabels(labels)
                setDatasets(datasets)
                setDataHasNonEmptyEntries(dataHasNonEmptyEntries)
            } catch (error) {
                setError(UNKNOWN_ERROR_NO_INFO)
            } finally {
                setLoading(false)
            }
        }
        run()
    }, [categories, timeFrame])

    const title = useMemo(
        () => (categories.length === 1 ? categories[0].name : 'Result'),
        [categories]
    )

    const [chartWidth, setChartWidth] = useState(0)
    const [chartHeight, setChartHeight] = useState(0)

    return (
        <View style={styles.marginBottom}>
            <View style={[styles.cardTitleContainer, styles.marginBottomSmall]}>
                <Text style={[globalStyles.titleMedium]}>{title}</Text>
                <Dropdown
                    onChange={setTimeFrame}
                    value={timeFrame}
                    options={timeFrameOptions}
                />
            </View>
            <View
                style={[styles.card, loading ? styles.cardLoading : {}]}
                onLayout={({ nativeEvent }) => {
                    setChartHeight(Math.floor(nativeEvent.layout.height))
                    setChartWidth(Math.floor(nativeEvent.layout.width))
                }}
            >
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
                            {error}
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
                    <>
                        <ScrollView horizontal={true}>
                            <LineChart
                                data={{ labels, datasets }}
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
                                    backgroundGradientTo:
                                        colors.primary.highlight,
                                    color: genColorFn(colors.accent.regular),
                                    labelColor: genColorFn(
                                        colors.primary.textDark
                                    ),
                                }}
                                renderDotContent={customDotRenderFn}
                            />
                        </ScrollView>
                    </>
                )}
            </View>

            {dataHasNonEmptyEntries && categories.length > 1 && (
                <ScrollView
                    horizontal
                    contentContainerStyle={[
                        styles.legendsContainer,
                        { minWidth: chartWidth },
                    ]}
                >
                    {categories.map((category, index) => (
                        <View style={styles.legend}>
                            <View
                                style={[
                                    styles.legendIcon,
                                    { backgroundColor: datasetColors[index]() },
                                ]}
                            ></View>
                            <Text style={globalStyles.textSmall}>
                                {category.name}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            )}

            {dataHasNonEmptyEntries && timeFrame === 'LAST_30_DAYS' && (
                <Text style={[globalStyles.textSmall, styles.helpText]}>
                    Tip: Scroll to the left to see all the data
                </Text>
            )}
        </View>
    )
}

DashboardCard.propTypes = {
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
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
    legendsContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 18,
        marginTop: 10,
    },
    legend: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 6,
    },
    legendIcon: {
        borderRadius: 10000,
        height: 12,
        width: 12,
    },
})
