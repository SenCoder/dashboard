<template>
  <div class="panel">
    <panel-title :title="$route.meta.title"></panel-title>
    <div class="panel-body" v-loading="load_data" element-loading-text="拼命加载中">
      <el-row>
        <el-col :span="8">
          <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="名称:" prop="name">
              <el-input v-model="form.name" placeholder="请输入内容" style="width: 250px;"></el-input>
            </el-form-item>
            <el-form-item label="创建人:" prop="create_by">
              <el-input v-model="form.create_by" placeholder="请输入姓名" style="width: 250px;"></el-input>
            </el-form-item>
           
            <el-form-item label="描述:">
              <el-input type="textarea" v-model="form.desc" style="width: 250px;"></el-input>
            </el-form-item>

            <el-form-item label="处理人:" prop="mail">
              <el-input type="textarea" placeholder="邮箱用分号分隔" v-model="form.mail_to" style="width: 250px;"></el-input>
            </el-form-item>

            <el-form-item label="抄送人:">
              <el-input type="textarea" placeholder="邮箱用分号分隔" v-model="form.mail_cc" style="width: 250px;"></el-input>
            </el-form-item>

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
      form: {
        name: null,
        desc: "",
        mail_to : null,
        mail_cc : null,
        create_by : null,
      },
      route_id: this.$route.params.id,
      load_data: false,
      on_submit_loading: false,
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        create_by: [{ required: true, message: "创建人不能为空", trigger: "blur" }]
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
        .then(data => {
          this.load_data = false;
          this.form = data;
          
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
        console.log(this.form)
        console.log("debug")
        this.$fetch.api_table
          .save(this.form)
          .then(({ msg }) => {
            // this.$message.success(msg);
            setTimeout(this.$router.back(), 500);
          })
          .catch((error) => {
            console.log(error)
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
