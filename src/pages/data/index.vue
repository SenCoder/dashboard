<template>
    <div class="panel">
        <panel-title :title="$route.meta.title">
            <span>{{ msg }}</span>
        </panel-title>
        <!-- <div class="panel-body">{{ msg }}</div> -->
        <div class="panel-body" >
            <!-- <charts :options="optionA" style="height: 700px"></charts> -->
            <!-- <ve-line :data="firstChartData"></ve-line> -->
            <el-row :gutter="12">
                <el-col :span="6">
                    <el-card shadow="always">历史告警 12 个</el-card>
                </el-col>
                <el-col :span="6">
                    <el-card shadow="always">运行时长 720 h</el-card>
                </el-col>
                <el-col :span="6">
                    <el-card shadow="always">监控指标 24 个</el-card>
                </el-col>
                <el-col :span="6">
                    <el-card shadow="always">保留</el-card>
                </el-col>
            </el-row>

            <el-row :gutter="12" style="margin-top:40px" v-loading="loading" 
            -loading-text="拼命加载中">
                <!-- <el-col :span="12">
                    <el-card shadow="always">
                    <ve-line :data="chartData"></ve-line>
                    </el-card>
                </el-col>-->
                <div v-for="chart in chartDataSet">
                    <el-col :span="12">
                        <ve-line :data="chart.chartData" :settings="chart.settings"></ve-line>
                    </el-col>
                </div>
            </el-row>
        </div>
    </div>
</template>
<script type="text/javascript">
import { panelTitle } from "components";

export default {
    created() {
        this.getInfluxData();
        console.log("chartDataSet", this.chartDataSet);
    },
    methods: {
        getInfluxData() {
            this.$fetch.targetApi
                .getMetric(
                    {
                        metric: "all"
                    },
                    {
                        id: this.$route.params.id
                    }
                )
                .then(response => {
                    this.loading = false;
                    console.log(response);
                    if (response.Body && response.Body.results) {
                        this.$message.success(response.Description);
                        this.chartDataSet = this.influxdataToChartData(
                            response.Body
                        );
                    } else {
                        this.$message.success("No valid data in response");
                        this.chartDataSet = this.influxdataToChartData(
                            this.influxdata
                        );
                    }
                })
                .catch(msg => {
                    this.loading = false;
                    console.log("catch =>", msg);
                    this.chartDataSet = this.influxdataToChartData(
                        this.influxdata
                    );
                });
        },

        influxdataToChartData(d) {
            let chartDataSet = [];

            for (var i = 0; i < d.results.length; i++) {
                let r = d.results[i];

                if (!r || !r.series) {
                    continue;
                }

                for (var j = 0; j < r.series.length; j++) {
                    let chartData = {
                        columns: [],
                        rows: []
                    };

                    let settings = {
                        labelMap: {
                            time: "time",
                            value: ""
                        }
                    };

                    let ser = r.series[j];
                    if (ser.name) {
                        settings.labelMap.value = ser.name;
                    } else {
                        continue;
                    }

                    if (ser.columns) {
                        chartData.columns = ser.columns;
                    } else {
                        continue;
                    }

                    if (ser.values) {
                        ser.values.forEach(v => {
                            let row = {
                                time: new Date(v[0]).toLocaleTimeString(
                                    "en-US"
                                ),
                                value: v[1]
                            };
                            chartData.rows.push(row);
                        });
                    } else {
                        continue;
                    }

                    chartDataSet.push({
                        chartData,
                        settings
                    });
                }
            }

            // console.log(chartDataSet);

            return chartDataSet;
        }
    },

    data() {
        // this.chartSettings = {
        //     stack: { sell: ["cost", "profit"] },
        //     area: true
        // };

        return {
            msg: "monitor data of instance " + this.$route.params.id,
            loading: true,
            chartDataSet: null,
            influxdata: {
                results: [
                    {
                        statement_id: 0,
                        series: [
                            {
                                name: "example_metric_cpu",
                                columns: ["time", "value"],
                                values: [
                                    ["2018-11-15T07:37:18.2486745Z", 22, "1"],
                                    ["2018-11-15T07:42:56.9873263Z", 24, "1"],
                                    ["2018-11-15T07:43:09.4867238Z", 25, "1"],
                                    ["2018-11-15T07:43:14.7442827Z", 26, "1"],
                                    ["2018-11-15T07:43:25.0154575Z", 26, "1"]
                                ]
                            }
                        ]
                    },
                    {
                        statement_id: 1,
                        series: [
                            {
                                name: "example_metric_mem",
                                columns: ["time", "value"],
                                values: [
                                    ["2018-11-15T07:37:18.2486745Z", 72, "1"],
                                    ["2018-11-15T07:42:56.9873263Z", 74, "1"],
                                    ["2018-11-15T07:43:09.4867238Z", 75, "1"],
                                    ["2018-11-15T07:43:14.7442827Z", 76, "1"],
                                    ["2018-11-15T07:43:25.0154575Z", 76, "1"]
                                ]
                            }
                        ]
                    }
                ]
            }
        };
    },
    components: {
        panelTitle
    }
};
</script>
