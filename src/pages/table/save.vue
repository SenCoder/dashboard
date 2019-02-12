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
              <el-input v-model="form.create_by" placeholder="请输入创建人" style="width: 250px;"></el-input>
            </el-form-item>
            <el-form-item label="状态:">
              <el-radio-group v-model="form.sex">
                <el-radio :label="1">正常</el-radio>
                <el-radio :label="2">故障</el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- <el-form-item label="生日:">
              <el-date-picker
                v-model="form.birthday"
                type="date"
                format="yyyy-MM-dd"
                :editable="false"
                @change="on_change_birthday"
                placeholder="选择生日"
                style="width: 250px;"
              ></el-date-picker>
            </el-form-item>-->
            <el-form-item label="描述:">
              <el-input type="textarea" v-model="form.desc" style="width: 250px;"></el-input>
            </el-form-item>

            <el-form-item label="监控项:" prop="metric">
              <el-table :data="form.items" border style="width: 100%;">
                <el-table-column prop="key" label="名称" width="120"></el-table-column>
                <el-table-column prop="value_type" label="类型" width="120"></el-table-column>
                <el-table-column prop="unit" label="单位" width="120"></el-table-column>
                <el-table-column prop="description" label="描述"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" disabled>编辑</el-button>
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

            <el-form-item>
              <el-button type="text" @click="dialogFormVisible = true">添加监控项</el-button>
            </el-form-item>

            <el-dialog title="添加监控项" :visible.sync="dialogFormVisible">
              <el-form :model="form">
                <el-form-item label="名称" :label-width="formLabelWidth">
                  <el-input v-model="current.key" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth">
                  <el-input v-model="current.description" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="单位" :label-width="formLabelWidth">
                  <el-select v-model="current.unit" placeholder="请选择">
                    <el-option label="%" value="%"></el-option>
                    <el-option label="B" value="B"></el-option>
                    <el-option label="MB" value="MB"></el-option>
                    <el-option label="GB" value="GB"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="类型" :label-width="formLabelWidth">
                  <el-select v-model="current.value_type" placeholder="请选择">
                    <el-option label="GAUGE" value="GAUGE"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="on_set_item">确 定</el-button>
              </div>
            </el-dialog>

            <!-- <el-form-item label="邮编:">
              <el-input
                placeholder="请输入内容"
                :value="412300"
                :controls="false"
                v-model="form.zip"
                style="width: 250px;"
                :maxlength="6"
                :minlength="6">
              </el-input>
            </el-form-item>-->
            <el-form-item>
              <el-button type="primary" @click="on_submit_form" :loading="on_submit_loading">提交</el-button>
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
      dialogFormVisible: false,
      current: {
        key: null,
        description: null,
        unit: null,
        value_type: null
      },
      formLabelWidth: "120px",
      form: {
        name: null,
        create_by: null,
        items: [],
        description: "新增组件"
      },
      route_id: this.$route.params.id,
      load_data: false,
      on_submit_loading: false,
      rules: {
        name: [{ required: true, message: "组件名称不能为空", trigger: "blur" }],
        create_by: [{ required: true, message: "创建人不能为空", trigger: "blur" }],
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
      this.$fetch.monitorApi
        .get({
          id: this.route_id
        })
        .then(data => {
          this.load_data = false
          this.form = data.Body
        })
        .catch(() => {
          this.load_data = false;
        });
    },
    //时间选择改变时
    on_change_birthday(val) {
      this.$set(this.form, "birthday", val);
    },
    on_set_item(event) {
      // this.$set(this.form, "birthday", val);
      this.dialogFormVisible = false;

      var newObj = JSON.parse(JSON.stringify(this.current));
      console.log(newObj);
      if (this.form.items == null) {
        this.form.items = []
      }
      this.form.items.push(newObj);
    },
    //提交
    on_submit_form() {
      this.$refs.form.validate(valid => {
        if (!valid) return false;
        this.on_submit_loading = true;

        if (this.route_id) {
          this.form.id = this.route_id
        }

        this.$fetch.monitorApi
          .save(this.form)
          .then(response => {
            console.log(response)
            this.$message.success("操作成功");
            setTimeout(this.$router.back(), 500);
          })
          .catch((error) => {
            console.log(error)
            this.on_submit_loading = false;
          });
      });
    },

    handleEdit(index, row) {
      // let edited = this.form.items.splice(index, 1);
      this.current = this.form.items[0]
      this.dialogFormVisible = true
    },

    handleDelete(index, row) {
      this.form.items.splice(index, 1);
    }
  },

  components: {
    panelTitle
  }
};
</script>
