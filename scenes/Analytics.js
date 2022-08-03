import React from 'react';
import { Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Box, Icon, Text, Factory, View, Column, Row, useTheme, Center, Heading, Card } from 'native-base'
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";


const generateMockFlowData = () => {
    const data = [];
    for (let i = 0; i < 7; i++) {
        data.push(Math.round(Math.floor(Math.random() * 10)));
    }
    return data;
}

const generateMockMoodData = (themeColors) => {
    const data = [
        {
            name: "Happy",
            moodScore: 20,
            color: themeColors.secureCycle.tertiary,
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "Sad",
            moodScore: 40,
            color: themeColors.secureCycle.primaryLight,
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "Angry",
            moodScore: 20,
            color: themeColors.secureCycle.primary,
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "Depressed",
            moodScore: 10,
            color: themeColors.secureCycle.secondary,
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        }
    ];
    return data;
}

Analytics.propTypes = {

};

function Analytics(props) {
    const { colors } = useTheme();
    const chartConfig = {
        backgroundGradientFrom: colors.secureCycle.primary,
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: colors.secureCycle.primaryLight,
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => colors.secureCycle.ter,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
    };
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    return (
        <Box backgroundColor="secureCycle.white" alignContent="center">
            <Center>
                <Column h="100%" marginBottom={5}>
                    <Box shadow={5} paddingTop={5} background="secureCycle.white">
                        <Center>
                            <Heading color="secureCycle.dark" size='lg'>Weekly Flow Breakdown</Heading>
                        </Center>
                        <LineChart
                            data={{
                                labels: ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"],
                                datasets: [
                                    {
                                        data: generateMockFlowData()
                                    }
                                ]
                            }}
                            width={screenWidth} // from react-native
                            height={screenHeight * .35}
                            yAxisLabel=""
                            yAxisSuffix="k"
                            yAxisInterval={1} // optional, defaults to 1
                            chartConfig={{
                                backgroundGradientFrom: colors.secureCycle.tertiary,
                                backgroundGradientTo: colors.secureCycle.tertiaryLight,
                                decimalPlaces: 2, // optional, defaults to 2dp
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 0
                                },
                                propsForDots: {
                                    r: "6",
                                    strokeWidth: "2",
                                    fill: colors.secureCycle.primaryLight,
                                    stroke: colors.secureCycle.dark
                                }
                            }}
                            bezier
                            style={{
                                marginVertical: 8,
                                borderRadius: 0
                            }}
                        />
                    </Box>
                    <Row>
                        <Column>
                            <Box background={colors.secureCycle.white} shadow={5}>
                                <Center>
                                    <Heading color="secureCycle.dark" size='lg'>Weekly Mood Breakdown</Heading>
                                </Center>
                                <PieChart
                                    data={generateMockMoodData(colors)}
                                    width={screenWidth}
                                    height={220}
                                    chartConfig={chartConfig}
                                    accessor={"moodScore"}
                                    backgroundColor={"transparent"}
                                />
                            </Box>
                        </Column>
                    </Row>
                </Column>
            </Center>
        </Box>
    );
}

export default Analytics;