<template>
    <div class="panel">
        <panel-title :title="$route.meta.title">
            <el-button @click.stop="on_refresh" size="small">
                <i class="fa fa-refresh"></i>
            </el-button>
            <router-link :to="{name: 'tableAdd'}" tag="span">
                <el-button type="primary" icon="plus" size="small" disabled>新增实例</el-button>
            </router-link>
        </panel-title>

        <div class="panel-body">
            <div style="margin-top: 10px;margin-bottom: 20px;">
                <el-radio-group
                    v-model="selector.id"
                    size="small"
                    @change="onSelectChange"
                    fill="#65cea7"
                >
                    <el-radio-button v-for="item in tags" :label="item.id">{{item.name}}</el-radio-button>
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
                <el-table-column prop="id" label="id" width="80" sortable>
                     <template scope="props">
                        <span v-text="props.row.id" style="font-size:12px;"></span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名称" width="240" sortable>
                    <template slot-scope="scope">
                        <router-link
                            :to="{name: 'instanceDetail', params: {id: scope.row.id}}"
                            tag="span"
                        >
                            <el-button type="text" size="small">{{scope.row.name}}</el-button>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="100" sortable>
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status === 0" type="success" disable-transitions>正常</el-tag>
                        <el-tag v-else type="warning" disable-transitions>故障</el-tag>
                    </template>
                    <!-- <template scope="props">
                        <span v-text="props.row.status == 0 ? '正常' : '故障'"></span>
                    </template>-->
                    <!-- <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>姓名: {{ scope.row.name }}</p>
                            <p>住址: {{ scope.row.address }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-tag size="medium">{{ scope.row.name }}</el-tag>
                            </div>
                        </el-popover>
                    </template>-->
                </el-table-column>

                <el-table-column prop="last_access" label="上线时间" width="180" sortable>
                    <template scope="props">
                        <!-- <span v-text="props.row.last_access"></span> -->
                        <span
                            style="font-size:12px;"
                        >{{ new Date(props.row.last_access).toLocaleString("en-US") }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="site_id" label="可用区" width="120" sortable>
                    <template scope="props">
                        <span v-text="props.row.site_id" style="font-size:12px;"></span>
                    </template>
                </el-table-column>
                <el-table-column prop="template_id" label="告警模板" width="100">
                    <template scope="props">
                        <span v-text="props.row.template_id" style="font-size:12px;"></span>
                    </template>
                </el-table-column>
                <el-table-column prop="description" label="描述">
                    <template scope="props">
                        <span v-text="props.row.description" style="font-size:12px;"></span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">配置告警</el-button>
                        <el-button
                            type="danger"
                            size="mini"
                            @click="disableAlert(scope.$index, scope.row)"
                            :disabled="!scope.row.template_id || scope.row.template_id <= 0"
                        >关闭告警</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <bottom-tool-bar>
                <el-button
                    type="danger"
                    icon="delete"
                    size="small"
                    :disabled="true"
                    @click="on_batch_del"
                    slot="handler"
                >
                    <span>批量删除</span>
                </el-button>
                <div slot="page">
                    <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="10"
                        layout="total, prev, pager, next"
                        :total="total"
                    ></el-pagination>
                </div>
            </bottom-tool-bar>

            <el-dialog title="配置模板" :visible.sync="dialogFormVisible">
                <el-form :model="form" :rules="rules" ref="form">
                    <!-- <el-form-item label="活动名称" :label-width="formLabelWidth">
                        <el-input v-model="form.name" autocomplete="off"></el-input>
                    </el-form-item>-->
                    <el-form-item label="选择模板" :label-width="formLabelWidth" prop="template_id">
                        <el-select v-model="form.template_id" placeholder="选择告警模板">
                            <!-- <el-option
                                v-for="item in templates"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            ></el-option>-->
                            <el-option
                                v-for="item in templates"
                                v-if="item.monitor_app_id == current.monitor_app_id"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="onTemplateSet">确 定</el-button>
                </div>
            </el-dialog>
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
            length: 15,
            //请求时的loading效果
            load_data: true,
            //批量选择数组
            batch_select: [],
            dialogFormVisible: false,
            formLabelWidth: "120px",

            templates: [],
            current: null,
            selector: {
                id: 0,
                name: "all"
            },
            tags: [
                {
                    id: 0,
                    name: "all"
                },
                {
                    id: 1,
                    name: "mongodb"
                },
                {
                    id: 2,
                    name: "mysql"
                },
                {
                    id: 3,
                    name: "postgresql"
                },
                {
                    id: 4,
                    name: "redis"
                },
                {
                    id: 5,
                    name: "mycat"
                },
                {
                    id: 6,
                    name: "nginx"
                },
                {
                    id: 7,
                    name: "app"
                }
            ],

            form: {
                template_id: null
            },

            rules: {
                template_id: [
                    {
                        required: true,
                        message: "请选择告警模板",
                        type: "number",
                        trigger: "change"
                    }
                ]
            }
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
            this.$fetch.targetApi
                .list({
                    page: this.currentPage,
                    length: this.length,
                    monitor_app_id: this.selector.id
                })
                .then(data => {
                    this.load_data = false;
                    this.table_data = data.Body.result;
                    this.currentPage = 1;
                    this.total = 1;
                })
                .catch(error => {
                    console.log(error);
                    this.load_data = false;
                });
        },

        getTemplates() {
            this.$fetch.triggerApi
                .list({
                    page: this.currentPage,
                    length: this.length
                })
                .then(data => {
                    this.templates = data.Body.result;
                    this.currentPage = 1;
                    this.total = 1;
                    console.log(this.templates);
                })
                .catch(error => {
                    console.log(error);
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
                    this.$fetch.targetApi
                        .del(item)
                        .then(msg => {
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
                    this.$fetch.targetApi
                        .batch_del(this.batch_select)
                        .then(({ msg }) => {
                            this.get_table_data();
                            this.$message.success(msg);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                })
                .catch(error => {
                    console.log(error);
                });
        },
        handleEdit(index, row) {
            this.getTemplates();
            this.current = row;
            this.form.template_id = null;
            this.dialogFormVisible = true;
        },
        disableAlert(index, row) {
            row.template_id = null;
            this.$fetch.targetApi
                .put({ action: "unbindTemplate" }, row)
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    console.log(error);
                });
        },
        onTemplateSet(event) {
            this.$refs.form.validate(valid => {
                console.log("dd", this.form);
                if (!valid) return false;

                this.current.template_id = this.form.template_id;
                this.form.template_id = null;
                this.$fetch.targetApi
                    .put({ action: "bindTemplate" }, this.current)
                    .then(response => {
                        console.log(response);
                        this.on_refresh();
                    })
                    .catch(error => {
                        console.log(error);
                    });
                this.dialogFormVisible = false;
            });
        },

        onSelectChange(value) {
            // this.selector = {
            //     id: value
            // };
            this.on_refresh();
        }
    }
};
</script>
