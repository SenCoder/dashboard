<template>
    <div class="panel">
        <panel-title :title="$route.meta.title"></panel-title>
        <div class="panel-body" v-loading="load_data" element-loading-text="拼命加载中">
            <el-row>
                <el-col :span="18">
                    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                        <el-form-item label="名称:" prop="name">
                            <el-input v-model="form.name" placeholder="请输入名称" style="width: 250px;"></el-input>
                        </el-form-item>
                        <el-form-item label="创建人:" prop="create_by">
                            <el-input
                                v-model="form.create_by"
                                placeholder="请输入创建人"
                                style="width: 250px;"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="组件:" prop="triggers">
                            <el-select
                                v-model="form.monitor_app_id"
                                placeholder="请选择组件类型"
                                style="width: 250px;"
                            >
                                <el-option
                                    v-for="item in pods"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="描述:">
                            <el-input
                                type="textarea"
                                v-model="form.description"
                                style="width: 250px;"
                            ></el-input>
                        </el-form-item>

                        <el-form-item label="处理人:" prop="mail_to">
                            <el-input type="textarea" v-model="form.mail_to" style="width: 250px;"></el-input>
                        </el-form-item>

                        <el-form-item label="抄送人:">
                            <el-input type="textarea" v-model="form.mail_cc" style="width: 250px;"></el-input>
                        </el-form-item>

                        <el-form-item label="报警规则:" prop="trigger_rule">
                            <el-table :data="form.triggers" border style="width: 100%;">
                                <el-table-column prop="name" label="名称" width="180"></el-table-column>
                                <el-table-column prop="description" label="描述"></el-table-column>
                                <el-table-column label="操作" width="180">
                                    <template slot-scope="scope">
                                        <el-button
                                            size="mini"
                                            @click="handleEdit(scope.$index, scope.row)"
                                            disabled
                                        >编辑</el-button>
                                        <el-button
                                            size="mini"
                                            type="danger"
                                            @click="handleDelete(scope.$index, scope.row)"
                                            width="40"
                                        >删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>

                        <el-dialog title="新增规则" :visible.sync="dialogFormVisible">
                            <el-form :model="currentTrigger" ref="currentTrigger">
                                <el-form-item label="名称:" prop="name" :label-width="formLabelWidth">
                                    <el-input v-model="currentTrigger.name" placeholder="请输入名称"></el-input>
                                </el-form-item>

                                <el-form-item label="监控指标" :label-width="formLabelWidth">
                                    <el-select
                                        v-model="currentExpression.metric"
                                        placeholder="请选择监控指标"
                                    >
                                        <el-option
                                            v-for="item in triggerItems"
                                            :key="item.id"
                                            :label="item.key"
                                            :value="item.key"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item label="函数" :label-width="formLabelWidth">
                                    <el-select v-model="currentExpression.func" placeholder="请选择函数">
                                        <el-option label="nodata" value="nodata"></el-option>
                                        <el-option label="last" value="last"></el-option>
                                        <el-option label="mean" value="mean"></el-option>
                                        <el-option label="min" value="min"></el-option>
                                        <el-option label="max" value="max" disabled></el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item label="操作符" :label-width="formLabelWidth">
                                    <el-select
                                        v-model="currentExpression.operator"
                                        placeholder="请选择操作符"
                                    >
                                        <el-option label=">" value=">"></el-option>
                                        <el-option label="<" value="<"></el-option>
                                        <el-option label="=" value="="></el-option>
                                        <el-option label=">=" value=">="></el-option>
                                        <el-option label="<=" value="<="></el-option>
                                        <el-option label="!=" value="!="></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item
                                    label="阈值"
                                    :label-width="formLabelWidth"
                                    :rules="[{ required: true, message: '阈值不能为空'},{ type: 'number', message: '阈值必须为数字'}]"
                                >
                                    <el-input
                                        v-model.number="currentExpression.right_value"
                                        autocomplete="off"
                                    ></el-input>
                                </el-form-item>
                                <!-- <el-form-item label="周期" :label-width="formLabelWidth">
                                    <el-input-number
                                        placeholder="周期"
                                        :controls="false"
                                        v-model="form.time"
                                    ></el-input-number>
                                </el-form-item>-->
                                <el-form-item label="告警级别" :label-width="formLabelWidth">
                                    <el-select v-model="currentTrigger.level" placeholder="告警级别">
                                        <el-option label="warn" value="3"></el-option>
                                        <el-option label="fatal" value="2"></el-option>
                                        <el-option label="panic" value="1"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="dialogFormVisible = false">取 消</el-button>
                                <el-button
                                    type="primary"
                                    @click="onTriggerSet('currentTrigger')"
                                >确 定</el-button>
                            </div>
                        </el-dialog>

                        <el-form-item>
                            <el-button type="text" @click="handleAddTrigger">添加规则</el-button>
                        </el-form-item>

                        <el-form-item>
                            <el-button
                                type="primary"
                                @click="on_submit_form"
                                :loading="on_submit_loading"
                            >确定</el-button>
                            <el-button @click="$router.back()">取消</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script type="text/javascript">
import { panelTitle } from "components";

export default {
    data() {
        return {
            pods: null,

            currentExpression: {
                metric: "",
                operator: "",
                func: "",
                right_value: null
            },

            currentTrigger: {
                name: "",
                level: null,
                description: "",
                expressions: []
            },

            triggerItems: [],

            form: {
                id: null,
                name: null,
                monitor_app_id: null,
                description: "",
                create_by: "",
                mail_to: "",
                mail_cc: "",
                triggers: []
            },
            route_id: this.$route.params.id,
            load_data: false,
            on_submit_loading: false,
            dialogFormVisible: false,
            formLabelWidth: "100px",
            rules: {
                name: [
                    {
                        required: true,
                        message: "名称不能为空",
                        trigger: "blur"
                    }
                ],
                mail_to: [
                    {
                        required: true,
                        message: "处理人不能为空",
                        trigger: "blur"
                    }
                ],
                create_by: [
                    {
                        required: true,
                        message: "创建人不能为空",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    created() {
        this.getPods();
        this.route_id && this.get_form_data();
    },
    methods: {
        //获取数据
        get_form_data() {
            this.load_data = true;
            this.$fetch.triggerApi
                .get({
                    id: this.route_id
                })
                .then(data => {
                    this.load_data = false;
                    console.log("to update", data.Body);
                    this.form = data.Body;
                })
                .catch(error => {
                    console.log("catch", error);
                    this.load_data = false;
                });
        },
        getPods() {
            this.$fetch.monitorApi
                .list({
                    page: this.currentPage,
                    length: this.length
                })
                .then(data => {
                    this.pods = data.Body.result;
                    this.currentPage = 1;
                    this.total = 1;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        getTriggerItems() {
            this.$fetch.monitorApi
                .get({
                    id: this.form.monitor_app_id
                })
                .then(data => {
                    if (data.Body.items != undefined) {
                        this.triggerItems = data.Body.items;
                    }
                })
                .catch(msg => {
                    console.log("catch", msg);
                });
        },
        onTriggerSet(formName) {
            this.$refs[formName].currentTrigger.validate(valid => {
                if (!valid) {
                    console.log("error submit!!");
                    return false;
                }
            });

            this.dialogFormVisible = false;
            let exp = this.currentExpression;

            this.currentExpression = {
                metric: "",
                operator: "",
                func: "",
                right_value: null
            };

            this.currentTrigger.expressions.push(exp);
            let trg = this.currentTrigger;
            trg.level = Number(trg.level);

            this.currentTrigger = {
                name: "",
                level: null,
                description: "",
                expressions: []
            };

            trg.description =
                exp.func +
                "(" +
                exp.metric +
                ") " +
                exp.operator +
                " " +
                exp.right_value;
            console.log(trg);
            if (this.form.triggers == null) {
                this.form.triggers = [];
            }
            console.log(trg);
            this.form.triggers.push(trg);
        },
        //提交
        on_submit_form() {
            this.$refs.form.validate(valid => {
                if (!valid) return false;
                this.on_submit_loading = true;

                if (this.route_id) {
                    this.form.id = this.route_id;
                    this.$fetch.triggerApi
                        .put(this.form)
                        .then(response => {
                            console.log(response);
                            this.$message.success(response.Description);
                            setTimeout(this.$router.back(), 500);
                        })
                        .catch(msg => {
                            console.log(msg);
                            this.on_submit_loading = false;
                        });
                } else {
                    this.$fetch.triggerApi
                        .save(this.form)
                        .then(response => {
                            console.log(response);
                            this.$message.success(response.Description);
                            setTimeout(this.$router.back(), 500);
                        })
                        .catch(msg => {
                            console.log(msg);
                            this.on_submit_loading = false;
                        });
                }
            });
        },

        handleAddTrigger() {
            this.dialogFormVisible = true;
            this.getTriggerItems();
        },

        handleEdit(index, row) {
            this.current = this.form.triggers[0];
            this.dialogFormVisible = true;
        },

        handleDelete(index, row) {
            this.form.triggers.splice(index, 1);
        }
    },
    components: {
        panelTitle
    }
};
</script>
