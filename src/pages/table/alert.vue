<template>
  <div class="panel">
    <panel-title :title="$route.meta.title">
      <el-button @click.stop="on_refresh" size="small">
        <i class="fa fa-refresh"></i>
      </el-button>
      <router-link :to="{name: 'alertAppAdd'}" tag="span">
        <el-button type="primary" icon="plus" size="small">新增应用</el-button>
      </router-link>
    </panel-title>
    <div class="panel-body">
      <el-table
        :data="table_data"
        v-loading="load_data"
        element-loading-text="拼命加载中"
        border
        @selection-change="on_batch_select"
        style="width: 100%;"
      >
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column type="expand" label="详情">
          <template slot-scope="props">
            <el-form label-position="right" inline class="demo-table-expand">
              <el-form-item label="应用名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="创建人">
                <span>{{ props.row.owner }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ props.row.create_at }}</span>
              </el-form-item>
              <el-form-item label="client_id">
                <span>{{ props.row.client_id }}</span>
              </el-form-item>
              <el-form-item label="client_secret">
                <span>{{ props.row.client_secret }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column prop="id" label="id" width="80" sortable></el-table-column>
        <el-table-column prop="name" label="名称" width="120" sortable></el-table-column>

        <el-table-column prop="create_by" label="创建人" width="100" sortable></el-table-column>
        <el-table-column prop="create_at" label="创建时间" width="180" sortable></el-table-column>
        <el-table-column prop="client_id" label="client_id" sortable></el-table-column>

        <el-table-column label="操作" width="180">
          <template scope="props">
            <router-link :to="{name: 'tableUpdate', params: {id: props.row.id}}" tag="span">
              <el-button type="info" size="small" icon="edit">修改</el-button>
            </router-link>
            <el-button type="danger" size="small" icon="delete" @click="delete_data(props.row)">删除</el-button>
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
            :page-size="10"
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
      length: 15,
      //请求时的loading效果
      load_data: true,
      //批量选择数组
      batch_select: []
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
      this.$fetch.alarmApi
        .list({
          page: this.currentPage,
          length: this.length
        })
        .then(data => {
          console.log("pagexx===");
          console.log(data);
          this.table_data = data.Body;
          this.currentPage = 1;
          this.total = 1;
          this.load_data = false;
        })
        .catch(error => {
          console.log("page2=== ", error);
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
          this.$fetch.alarmApi
            .del(item)
            .then(({ msg }) => {
              console.log("<< ", msg)
              
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
          this.$fetch.alarmApi
            .batch_del(this.batch_select)
            .then(({ msg }) => {
              this.get_table_data();
              this.$message.success(msg);
            })
            .catch(() => {});
        })
        .catch(() => {});
    }
  }
};
</script>
