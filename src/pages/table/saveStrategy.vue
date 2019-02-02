<template>
  <div class="panel">
    <panel-title :title="$route.meta.title"></panel-title>
    <div class="panel-body" v-loading="load_data" element-loading-text="拼命加载中">
      <el-row>
        <el-col :span="24">
          <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="名称:" prop="name">
              <el-input v-model="form.name" placeholder="请输入内容" style="width: 250px;"></el-input>
            </el-form-item>
            <el-form-item label="状态:">
              <el-radio-group v-model="form.sex">
                <el-radio :label="1">正常</el-radio>
                <el-radio :label="2">故障</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="年龄:">
              <el-input-number
                placeholder="请输入内容"
                :max="100"
                :min="1"
                :value="20"
                :controls="false"
                v-model="form.age"
                style="width: 250px;"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="生日:">
              <el-date-picker
                v-model="form.birthday"
                type="date"
                format="yyyy-MM-dd"
                :editable="false"
                @change="on_change_birthday"
                placeholder="选择生日"
                style="width: 250px;"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="组件:" prop="trigger">
              <el-select v-model="form.region" placeholder="请选择组件类型" style="width: 250px;">
                <el-option label="mongodb" value="mongodb"></el-option>
                <el-option label="redis" value="redis"></el-option>
                <el-option label="omp" value="omp"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="描述:">
              <el-input type="textarea" v-model="form.desc" style="width: 250px;"></el-input>
            </el-form-item>

            <el-form-item label="处理人:">
              <el-input type="textarea" v-model="form.group" style="width: 250px;"></el-input>
            </el-form-item>

            <el-form-item label="报警规则:" prop="trigger_rule">
              <el-table :data="rule_table_data" border style="width: 100%;">
                <el-table-column prop="name" label="名称" width="180"></el-table-column>
                <el-table-column prop="name" label="描述"></el-table-column>
              </el-table>
            </el-form-item>

            <el-dialog title="新增规则" :visible.sync="dialogFormVisible">
              <el-form :model="form">
                <el-form-item label="监控指标" :label-width="formLabelWidth">
                  <el-select v-model="form.metric" placeholder="请选择监控指标">
                    <el-option label="mongodb_cpu" value="metric_2"></el-option>
                    <el-option label="mongodb_mem" value="metric_2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="操作符" :label-width="formLabelWidth">
                  <el-select v-model="form.operator" placeholder="请选择操作符">
                    <el-option label=">" value="shanghai"></el-option>
                    <el-option label="<" value="shanghai"></el-option>
                    <el-option label="=" value="shanghai"></el-option>
                    <el-option label=">=" value="shanghai"></el-option>
                    <el-option label="<=" value="shanghai"></el-option>
                    <el-option label="!=" value="shanghai"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="阈值" :label-width="formLabelWidth">
                  <el-input-number
                    placeholder="阈值"
                    :max="100"
                    :min="1"
                    :value="20"
                    :controls="false"
                    v-model="form.threshold"
                  ></el-input-number>
                </el-form-item>
                <el-form-item label="周期" :label-width="formLabelWidth">
                  <el-input-number
                    placeholder="min"
                    :max="100"
                    :min="1"
                    :value="20"
                    :controls="false"
                    v-model="form.time"
                  ></el-input-number>
                </el-form-item>
                <el-form-item label="告警级别" :label-width="formLabelWidth">
                  <el-select v-model="form.level" placeholder="告警级别">
                    <el-option label="warn" value="1"></el-option>
                    <el-option label="fatal" value="2"></el-option>
                    <el-option label="panic" value="3"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
              </div>
            </el-dialog>

            <el-form-item>
              <el-button type="text" @click="dialogFormVisible = true">添加规则</el-button>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="on_submit_form" :loading="on_submit_loading">确定</el-button>
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
      form: {
        name: null,
        sex: 1,
        age: 20,
        birthday: this.$dateFormat(new Date(), "yyyy-MM-dd"),
        address: null,
        description: "新增组件"
      },
      route_id: this.$route.params.id,
      load_data: false,
      on_submit_loading: false,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }]
      }
    };
  },
  created() {
    this.route_id && this.get_form_data();
  },
  methods: {
    //获取数据
    get_form_data() {
      this.load_data = true;
      this.$fetch.api_table
        .get({
          id: this.route_id
        })
        .then(({ data }) => {
          this.form = data;
          this.load_data = false;
        })
        .catch(() => {
          this.load_data = false;
        });
    },
    //时间选择改变时
    on_change_birthday(val) {
      this.$set(this.form, "birthday", val);
    },
    //提交
    on_submit_form() {
      this.$refs.form.validate(valid => {
        if (!valid) return false;
        this.on_submit_loading = true;
        this.$fetch.api_table
          .save(this.form)
          .then(({ msg }) => {
            this.$message.success(msg);
            setTimeout(this.$router.back(), 500);
          })
          .catch(() => {
            this.on_submit_loading = false;
          });
      });
    }
  },
  components: {
    panelTitle
  }
};
</script>
