<template>
  <div class="ele-body">
    <div class="ele-page-header">
    </div>
    <el-card v-for="(item,index) in MenuList" :key="index" shadow="never">
      <!-- <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
      <div style="padding: 14px;">
        <div class="bottom clearfix">
          <el-button type="text" class="button">好吃的汉堡</el-button>
        </div>
      </div> -->

      <!-- <div class="demo-image">
        <el-image style="width: 100px; height: 100px" :src="url" :fit="fit"></el-image>
        <div class="bottom clearfix">
          <el-button type="text" class="button">好吃的汉堡</el-button>
        </div>
      </div> -->
      <div class="demo-image" style="display:flex;">
        <div class="block" v-for="(p) in item" :key="p.component">
          <!-- <el-image style="width: 100px; height: 100px" :src="url" fit="fill"></el-image> -->
          <div style="width:150px;height:120px;border-radius: 2px;margin-right: 100px;" @click="changeRoute(p.component)">
            <el-button type="text" class="button">
              <!-- <div style="width:150px;display: flex;justify-content: center;">
                <i class="el-icon-s-tools" style="font-size: 80px;"></i>
              </div> -->
              <div style="width:150px;display: flex;justify-content: center;">
                <!-- {{p.icon}} -->
                <i :class="p.icon" style="font-size: 80px;"></i>
              </div>
              <div style="width:150px;display: flex;justify-content: center;margin-top: 10px;color:#606266;">
                <div class="bottom clearfix">
                  <span>{{p.title}}</span>
                  <!-- <el-button type="text" class="button" style="font-size: 15px;">{{p.title}}</el-button> -->
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
        'el-icon-receiving',
        'el-icon-data-analysis',
        'el-icon-notebook-1',
        'el-icon-notebook-2',
        'el-icon-office-building',
        'el-icon-school',
        'el-icon-box',
        'el-icon-tickets',
        'el-icon-document-remove',
        'el-icon-s-order',
        'el-icon-wallet',
        'el-icon-discount',
        'el-icon-pie-chart',
        'el-icon-document-copy',
        'el-icon-document',
        'el-icon-s-claim',
        'el-icon-s-operation',
        'el-icon-s-promotion',
        'el-icon-s-shop'
      ]
    };
  },
  methods: {
    changeRoute(data) {
      console.log(data);
      this.$router.push(this.$route?.query?.from ?? data);
    },
    permission_groupList() {
      var permission_group = this.$store.state.user.info.permission_group;
      permission_group = permission_group.filter((res) => {
        return (
          res.title != '申领计划管理_审核按钮' &&
          res.title != '科室申领' &&
          res.title != '菜单列表'
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
            // permission_group2[i][j].icon = this.icons[startCount]
            startCount++;
          }
        } else {
          for (var j = 0; j < ListCount; j++) {
            //二维
            permission_group2[i][j] = permission_group[startCount];
            // permission_group2[i][j].icon = this.icons[startCount]
            startCount++;
          }
        }
      }
      console.log(permission_group2);
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
