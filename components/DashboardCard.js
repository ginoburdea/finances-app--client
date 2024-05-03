import { gql, useQuery } from '@apollo/client'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import PropTypes from 'prop-types'
import { colors, globalStyles } from '../utils/globalStyles.js'
import { useEffect, useMemo, useState } from 'react'
import Dropdown from './Dropdown.js'
import { UNKNOWN_ERROR_NO_INFO } from '../utils/errors.js'
import { BarChart } from 'react-native-chart-kit'
import dayjs from 'dayjs'

const query = gql`
    query($categoryId: ID!, $preset: DailyTotalsPreset!) {
        entryTotals(
            entryTotalsInput: { categoryId: $categoryId, preset: $preset }
        ) {
            date
            sum
        }
    }
`

const genColorFn = color => (opacity = 1) =>
    color + (opacity == 1 ? 'ff' : opacity * 100)

export default function DashboardCard({ categoryId, categoryName }) {
    const timeFrameOptions = [
        { label: 'Last 7 days', value: 'LAST_7_DAYS' },
        { label: 'Last 30 days', value: 'LAST_30_DAYS' },
    ]
    const [timeFrame, setTimeFrame] = useState(timeFrameOptions[0].value)

    const { loading, data, error, refetch } = useQuery(query, {
        variables: { categoryId, preset: timeFrame },
    })

    const [chartWidth, setChartWidth] = useState(0)
    const [chartHeight, setChartHeight] = useState(0)

    useEffect(() => {
        refetch({ categoryId, preset: timeFrame })
    }, [timeFrame])

    const [chartLabels, chartDataset] = useMemo(
        () => [
            (data?.entryTotals || []).map(entry =>
                dayjs(entry.date).format('MMM D')
            ),
            [
                {
                    data: (data?.entryTotals || []).map(entry => entry.sum),
                },
            ],
        ],
        [data]
    )

    const computedChartWidth = useMemo(
        () => (timeFrame === 'LAST_7_DAYS' ? chartWidth : chartWidth * 3.5),
        [timeFrame]
    )

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
                {loading && (
                    <View style={styles.center}>
                        <Text style={styles.textDark}>Loading...</Text>
                    </View>
                )}
                {error && (
                    <View style={styles.center}>
                        <Text style={styles.textDark}>
                            {UNKNOWN_ERROR_NO_INFO}
                        </Text>
                    </View>
                )}
                {data?.entryTotals && (
                    <ScrollView horizontal={true}>
                        <BarChart
                            data={{
                                labels: chartLabels,
                                datasets: chartDataset,
                            }}
                            verticalLabelRotation={-90}
                            xLabelsOffset={20}
                            width={computedChartWidth}
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
                        />
                    </ScrollView>
                )}
            </View>
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
    },
    textDark: {
        color: colors.primary.textDark,
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
})
