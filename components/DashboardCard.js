import { NetworkStatus, gql, useQuery } from '@apollo/client'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import PropTypes from 'prop-types'
import { colors, globalStyles } from '../utils/globalStyles.js'
import { useEffect, useMemo, useState } from 'react'
import Dropdown from './Dropdown.js'
import { UNKNOWN_ERROR_NO_INFO } from '../utils/errors.js'
import { LineChart } from 'react-native-chart-kit'
import dayjs from 'dayjs'

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

export default function DashboardCard({ categoryId, categoryName }) {
    const timeFrameOptions = [
        { label: 'Last 7 days', value: 'LAST_7_DAYS' },
        { label: 'Last 30 days', value: 'LAST_30_DAYS' },
    ]
    const [timeFrame, setTimeFrame] = useState(timeFrameOptions[0].value)

    const { loading, data, error, networkStatus, refetch } = useQuery(query, {
        variables: { categoryId, preset: timeFrame },
        notifyOnNetworkStatusChange: true,
    })

    const [chartWidth, setChartWidth] = useState(0)
    const [chartHeight, setChartHeight] = useState(0)

    useEffect(() => {
        refetch({ categoryId, preset: timeFrame })
    }, [timeFrame])

    const dataHasNonEmptyEntries = useMemo(() => {
        if (!data?.entryTotals) return false

        for (let i = 0; i < data.entryTotals.length; i++) {
            if (data.entryTotals[i].sum > 0) {
                return true
            }
        }

        return false
    }, [data])

    return (
        <View style={styles.marginBottom}>
            <View style={[styles.cardTitleContainer, styles.marginBottomSmall]}>
                <Text style={[globalStyles.titleMedium]}>{categoryName}</Text>
                <Dropdown
                    onChange={setTimeFrame}
                    value={timeFrame}
                    options={timeFrameOptions}
                />
            </View>
            <View
                style={[styles.card, loading ? styles.cardLoading : {}]}
                onLayout={({ nativeEvent }) => {
                    setChartHeight(nativeEvent.layout.height)
                    setChartWidth(nativeEvent.layout.width)
                }}
            >
                {(loading || networkStatus === NetworkStatus.refetch) && (
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
                                labels: data.entryTotals.map(entry =>
                                    dayjs(entry.date).format('MMM D')
                                ),
                                datasets: [
                                    {
                                        data: data.entryTotals.map(
                                            entry => entry.sum
                                        ),
                                    },
                                ],
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
    categoryId: PropTypes.string.isRequired,
    categoryName: PropTypes.string.isRequired,
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
