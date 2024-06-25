<template>
  <div class="ele-body">
    <div class="ele-page-header">
    </div>
    <el-card v-for="(item, index) in MenuList" :key="index" shadow="never">

      <div class="demo-image" style="display:flex;">
        <div class="block" v-for="(p) in item" :key="p.component">
          <div style="width:150px;height:120px;border-radius: 2px;margin-right: 100px;"
            @click="changeRoute(p.component)">
            <el-button type="text" class="button">
              <div style="width:150px;display: flex;justify-content: center;">
                <svg-icon :icon-class="p.icon" style="width: 80px;height: 80px;" />
              </div>
              <div style="width:150px;display: flex;justify-content: center;margin-top: 10px;color:#606266;">
                <div class="bottom clearfix">
                  <span>{{ p.title }}</span>
                </div>
              </div>
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { API_BASE_URL, BACK_BASE_URL } from '@/config/setting';
import { number } from 'echarts/core';

export default {
  name: 'MenuList',
  components: {
    // UserImport
  },
  data() {
    return {
      MenuList: null,
      icons: [
        "saomashouhuo",
        "light_batch_parallel",
        "kucunxiangqing",
        "churukujilu",
        "keshiguanli",
        "mobanguanli",
        "mulu",
        "kucuntixing",
        "microscope",
        "listtixing",
        "liyongshuai",
        "jiesuanxinxi",
        "zonghejianguan_tongjifenxi_nor",
        "jiance",
        "keshi",
      ]
    };
  },
  methods: {
    changeRoute(data) {
      this.$router.push(this.$route?.query?.from ?? data);
    },
    permission_groupList() {
      var permission_group = this.$store.state.user.info.permission_group;
      permission_group = permission_group.filter((res) => {
        return (
          res.title != '申领计划管理_审核按钮' &&
          res.title != '申领计划管理_审批按钮' &&
          res.title != '科室申领' &&
          res.title != '菜单列表' &&
          res.title != '入库管理' &&
          res.title != 'UDI条码查询' &&
          res.title != 'UDI主码管理' 
        );
      });

      for (let i = 0; i < permission_group.length; i++) {
        permission_group[i].icon = this.icons[i];
      }

      var ListCount = 7;
      var ListCount2 = parseInt(permission_group.length / ListCount);

      var ListCount2Y = ListCount2;
      var ListCount3 = permission_group.length % ListCount;
      if (ListCount3 > 0) {
        ListCount2Y++;
      }

      var startCount = 0;
      var permission_group2 = new Array();

      for (var i = 0; i <= ListCount2; i++) {
        //一维
        permission_group2[i] = new Array();
        if (i == ListCount2) {
          for (var k = 0; k < ListCount3; k++) {
            //二维
            permission_group2[i][k] = permission_group[startCount];
            startCount++;
          }
        } else {
          for (var j = 0; j < ListCount; j++) {
            //二维
            permission_group2[i][j] = permission_group[startCount];
            startCount++;
          }
        }
      }
      // console.log(permission_group2);
      this.MenuList = permission_group2;
    }
  },
  computed: {
    // 是否开启响应式布局
    styleResponsive() {
      return this.$store.state.theme.styleResponsive;
    }
  },
  created() {
    // this.getdatasource();
    this.permission_groupList();
    // this.MenuList = this.$store.state.user.info.permission_group;
  }
};
</script>
