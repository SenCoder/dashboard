<template>
    <div class="panel">
        <panel-title :title="$route.meta.title">
            <el-button @click.stop="on_refresh" size="small">
                <i class="fa fa-refresh"></i>
            </el-button>
            <router-link :to="{name: 'tableAdd'}" tag="span">
                <el-button type="primary" icon="plus" size="small">新增组件</el-button>
            </router-link>
        </panel-title>
        <div class="panel-body">
            <div style="margin-top: 10px;margin-bottom: 20px;">
                <el-radio-group
                    v-model="selector"
                    size="small"
                    @change="onSelectChange"
                    fill="#65cea7"
                >
                    <el-radio-button v-for="item in tags" :label="item.value">{{item.key}}</el-radio-button>
                </el-radio-group>
            </div>

            <el-table
                :data="table_data"
                v-loading="load_data"
                element-loading-text="拼命加载中"
                border
                @selection-change="on_batch_select"
                style="width: 100%;"
            >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="id" width="80">
                    <template scope="props">
                        <span v-text="props.row.id" style="font-size:12px;"></span>
                    </template>
                </el-table-column>

                <el-table-column prop="name" label="名称" width="120">
                    <template scope="props">
                        <span v-text="props.row.name" style="font-size:12px;"></span>
                    </template>
                </el-table-column>
                <el-table-column prop="create_by" label="创建人" width="120">
                    <template scope="props">
                        <span v-text="props.row.create_by" style="font-size:12px;"></span>
                    </template>
                </el-table-column>
                <el-table-column prop="create_at" label="创建时间" width="200">
                    <template scope="props">
                        <span
                            style="font-size:12px;"
                        >{{ new Date(props.row.create_at).toLocaleString("en-US") }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="client_id" label="client_id">
                    <template scope="props">
                        <span v-text="props.row.client_id" style="font-size:12px;"></span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                    <template scope="props">
                        <router-link
                            :to="{name: 'tableUpdate', params: {id: props.row.id}}"
                            tag="span"
                        >
                            <!-- <el-button type="info" size="mini" icon="edit">修改</el-button> -->
                            <el-button type="info" size="mini">修改</el-button>
                        </router-link>
                        <el-button
                            type="danger"
                            size="mini"
                            @click="delete_data(props.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <bottom-tool-bar>
                <el-button
                    type="danger"
                    icon="delete"
                    size="small"
                    :disabled="batch_select.length === 0"
                    @click="on_batch_del"
                    slot="handler"
                >
                    <span>批量删除</span>
                </el-button>
                <div slot="page">
                    <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="this.length"
                        layout="total, prev, pager, next"
                        :total="total"
                    ></el-pagination>
                </div>
            </bottom-tool-bar>
        </div>
    </div>
</template>
<script type="text/javascript">
import { panelTitle, bottomToolBar } from "components";

export default {
    data() {
        return {
            table_data: null,
            //当前页码
            currentPage: 1,
            //数据总条目
            total: 0,
            //每页显示多少条数据
            length: 5,
            //请求时的loading效果
            load_data: true,
            //批量选择数组
            batch_select: [],

            selector: "all",
            tags: [
                {
                    key: "all",
                    value: "all"
                },
                {
                    key: "database",
                    value: "db"
                },
                {
                    key: "app",
                    value: "app"
                },
                {
                    key: "middleware",
                    value: "middleware"
                }
            ]
        };
    },
    components: {
        panelTitle,
        bottomToolBar
    },
    created() {
        this.get_table_data();
    },
    methods: {
        //刷新
        on_refresh() {
            this.get_table_data();
        },
        //获取数据
        get_table_data() {
            this.load_data = true;
            this.$fetch.monitorApi
                .list({
                    page: this.currentPage,
                    length: this.length,
                    filter: "tag",
                    key: this.selector
                })
                .then(data => {
                    this.load_data = false;
                    this.table_data = data.Body.result;
                    this.currentPage = data.Body.page;
                    this.total = data.Body.total;
                })
                .catch(() => {
                    this.load_data = false;
                });
        },
        //单个删除
        delete_data(item) {
            this.$confirm("此操作将删除该数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.load_data = true;
                    this.$fetch.monitorApi
                        .del(item)
                        .then(({ msg }) => {
                            this.get_table_data();
                            this.$message.success(msg);
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },
        //页码选择
        handleCurrentChange(val) {
            this.currentPage = val;
            this.get_table_data();
        },
        //批量选择
        on_batch_select(val) {
            this.batch_select = val;
        },
        //批量删除
        on_batch_del() {
            this.$confirm("此操作将批量删除选择数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.load_data = true;
                    this.$fetch.monitorApi
                        .batch_del(this.batch_select)
                        .then(({ msg }) => {
                            this.get_table_data();
                            this.$message.success(msg);
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },
        onSelectChange() {
            this.currentPage = 1;
            this.on_refresh();
        }
    }
};
</script>
