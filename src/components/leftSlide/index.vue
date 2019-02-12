<template>
  <div class="left-side">
    <div class="left-side-inner">
      <router-link to="/" class="logo block">
        <img src="./images/logo.png" alt="AdminX">
      </router-link>
      <el-menu class="menu-box" theme="dark" router :default-active="$route.path">
        <div v-for="(item, index) in nav_menu_data" :key="index">
          <el-menu-item
            class="menu-list"
            v-if="typeof item.child === 'undefined'"
            :index="item.path"
          >
            <i class="icon fa" :class="item.icon"></i>
            <span v-text="item.title" class="text"></span>
          </el-menu-item>
          <el-submenu :index="item.path" v-else>
            <template slot="title">
              <i class="icon fa" :class="item.icon"></i>
              <span v-text="item.title" class="text"></span>
            </template>
            <el-menu-item
              class="menu-list"
              v-for="(sub_item, sub_index) in item.child"
              :index="sub_item.path"
              :key="sub_index"
            >
              <!--<i class="icon fa" :class="sub_item.icon"></i>-->
              <span v-text="sub_item.title" class="text"></span>
            </el-menu-item>
          </el-submenu>
        </div>
      </el-menu>
    </div>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "slide",
  data() {
    return {
      nav_menu_data: [
        {
          title: "主页",
          path: "/home",
          icon: "fa-home"
        },
        {
          title: "监控服务",
          path: "/table",
          icon: "fa-table",
          child: [
            {
              title: "监控组件",
              path: "/monitor/pod"
            },
            {
              title: "监控实例",
              path: "/monitor/instance"
            },
             {
              title: "告警配置",
              path: "/monitor/strategy"
            }
          ]
        },
        {
          title: "消息推送",
          path: "/alert",
          icon: "fa-bar-chart-o",
          child: [
            {
              title: "数据统计",
              path: "/alert/chart"
            },
            {
              title: "应用接入",
              path: "/alert/app"
            },
             {
              title: "一键报警",
              path: "/alert/mock"
            }
          ]
        },
        {
          title: "测试",
          path: "/mock",
          icon: "fa-home"
        }
      ]
    };
  }
};
</script>
