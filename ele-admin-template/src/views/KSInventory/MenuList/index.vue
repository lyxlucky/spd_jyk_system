<template>
  <div class="ele-body">
    <div class="ele-page-header"> </div>
    <el-card v-for="(item, index) in MenuList" :key="index" shadow="never">
      <div class="demo-image" style="display: flex; flex-wrap: wrap">
        <div
          class="block"
          v-for="p in item"
          :key="p.component"
          style="margin: 10px"
        >
          <div
            style="
              width: 90px;
              height: 70px;
              border-radius: 2px;
              margin-right: 20px;
            "
            @click="changeRoute(p.component)"
          >
            <el-button type="text" class="button">
              <div style="width: 100px; display: flex; justify-content: center">
                <svg-icon
                  :icon-class="p.icon"
                  style="width: 40px; height: 40px"
                />
              </div>
              <div
                style="
                  width: 100px;
                  display: flex;
                  justify-content: center;
                  margin-top: 5px;
                  color: #606266;
                "
              >
                <div class="bottom clearfix">
                  <span>{{ p.title }}</span>
                </div>
              </div>
            </el-button>
          </div>
        </div>
      </div>
    </el-card>

    <div
      style="display: flex; justify-content: space-between; align-items: center"
    >
      <el-card style="height: 110px; width: 49.6%" shadow="never">
        <div class="demo-image" style="display: flex; flex-wrap: wrap">
          <div
            class="block"
            style="margin: 10px"
            v-for="(item, index) in StaticMenuList"
            :Key="index"
          >
            <div
              v-permission="[item.PERMISSION]"
              style="
                width: 90px;
                height: 70px;
                border-radius: 2px;
                margin-right: 20px;
              "
              @click="handleClickVisible(item.VISIBLE)"
            >
              <el-button type="text" class="button">
                <div
                  style="width: 100px; display: flex; justify-content: center"
                >
                  <svg-icon
                    :icon-class="item.ICON"
                    style="width: 40px; height: 40px"
                  />
                </div>
                <div
                  style="
                    width: 100px;
                    display: flex;
                    justify-content: center;
                    margin-top: 5px;
                    color: #606266;
                  "
                >
                  <div class="bottom clearfix">
                    <span>{{ item.TITLE }}</span>
                  </div>
                </div>
              </el-button>
            </div>
          </div>
        </div>
      </el-card>

      <el-card
        style="height: 110px; width: 49.6%; position: relative; bottom: 7px"
        shadow="never"
      >
        <div class="demo-image" style="display: flex; flex-wrap: wrap">
          <div
            class="block"
            v-for="(p, index) in NoticeMenuList"
            :key="index"
            style="margin: 10px"
          >
            <div
              style="
                width: 90px;
                height: 70px;
                border-radius: 2px;
                margin-right: 20px;
              "
              @click="changeRoute(p.component)"
            >
              <el-button type="text" class="button">
                <div
                  style="width: 100px; display: flex; justify-content: center"
                >
                  <svg-icon
                    :icon-class="p.icon"
                    style="width: 40px; height: 40px"
                  />
                </div>
                <div
                  style="
                    width: 100px;
                    display: flex;
                    justify-content: center;
                    margin-top: 5px;
                    color: #606266;
                  "
                >
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

    <!-- echarts 图表 -->
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
      "
    >
      <el-card v-loading="dataLoading" style="width: 50%">
        <el-date-picker
          v-model="dataYear"
          @change="getSaleroomData"
          type="year"
          value-format="yyyy"
          placeholder="请选择年份"
        >
        </el-date-picker>
        <ele-chart :option="saleChartOption" style="height: 285px" />
      </el-card>
      <el-card
        v-loading="lineLoading"
        style="width: 50%; position: relative; bottom: 7px"
      >
        <el-date-picker
          v-model="lineYear"
          @change="getLineChartData"
          type="year"
          value-format="yyyy"
          placeholder="请选择年份"
        >
        </el-date-picker>
        <ele-chart :option="lineChartOption" style="height: 285px" />
      </el-card>
    </div>

    <BidVarInfoDept :visible.sync="BidListShowEdit" />
    <VarietyDataLzhLook :visible.sync="VarietyDataLzhLookShow" />
    <DpetOneAuthWithDept :visible.sync="DpetOneAuthWithDeptShow" />
  </div>
</template>

<script>
  import BidVarInfoDept from '@/views/KSInventory/ReferenceComponent/BidVarInfoDept/index';
  import VarietyDataLzhLook from '@/views/KSInventory/ReferenceComponent/VarietyDataLzhLook/index';
  import DpetOneAuthWithDept from '@/views/KSInventory/ReferenceComponent/DpetOneAuthWithDept/index';
  import { API_BASE_URL, BACK_BASE_URL, BLACK_ROUTER } from '@/config/setting';
  import {
    getStaticsDataHistogram,
    getStaticsDataLineChart
  } from '@/api/KSInventory/MenuList/index';
  import EleChart from 'ele-admin/packages/ele-chart';
  export default {
    name: 'MenuList',
    components: {
      // UserImport
      EleChart,
      BidVarInfoDept,
      VarietyDataLzhLook,
      DpetOneAuthWithDept
    },
    data() {
      return {
        MenuList: null,
        NoticeMenuList: null,
        saleroomData: [],
        lineChartData: [],
        dataYear: this.$moment().format('YYYY'),
        lineYear: this.$moment().format('YYYY'),
        dataLoading: true,
        lineLoading: true,
        BidListShowEdit: false,
        VarietyDataLzhLookShow: false,
        DpetOneAuthWithDeptShow: false,
        StaticMenuList: [
          {
            ICON: 'zhongbiaomulu',
            TITLE: '中标目录',
            VISIBLE: 'BidListShowEdit',
            PERMISSION: 'zhongbiaomulu'
          },
          {
            ICON: 'zaiyongmulu',
            TITLE: '在用目录',
            VISIBLE: 'VarietyDataLzhLookShow',
            PERMISSION: 'zaiyongmulu'
          },
          {
            ICON: 'keshimulu',
            TITLE: '科室目录',
            VISIBLE: 'DpetOneAuthWithDeptShow',
            PERMISSION: 'keshimulu'
          },
          {
            ICON: 'shenglingzhiying',
            TITLE: '申领指引',
            VISIBLE: '',
            PERMISSION: 'shenlinzhiyin'
          }
        ]
      };
    },
    methods: {
      handleClickVisible(visibleProperty) {
        if (visibleProperty) {
          this[visibleProperty] = true;
        } else {
          this.downloadGuide();
        }
      },
      downloadGuide() {
        var url = `${BACK_BASE_URL}/ZL/上药控股SPD科室操作手册.pdf`;
        window.open(url.replace('/undefined', ''));
      },
      /* 获取数据 */
      getSaleroomData() {
        this.$nextTick(() => {
          this.dataLoading = true;
          getStaticsDataHistogram({ time: this.dataYear })
            .then((res) => {
              this.dataLoading = false;
              this.saleroomData = res.result;
            })
            .catch((err) => {
              this.$message.error(err);
              this.dataLoading = false;
            });
        });
      },
      getLineChartData() {
        this.$nextTick(() => {
          this.lineLoading = true;
          getStaticsDataLineChart({ time: this.lineYear })
            .then((res) => {
              this.lineLoading = false;
              this.lineChartData = res.result;
            })
            .catch((err) => {
              this.$message.error(err);
              this.lineLoading = false;
            });
        });
      },
      changeRoute(data) {
        this.$router.push(this.$route?.query?.from ?? data);
      },
      permission_groupList() {
        var permission_group = this.$store.state.user.info.permission_group;

        //控制首页菜单显示
        //'新资质审核',
        const blackList = [
          '申领计划管理_审核按钮',
          '申领计划管理_审批按钮',
          '科室申领',
          '菜单列表',
          '入库管理',
          'UDI条码查询',
          'UDI主码管理',
          'HIS使用计费',
          '库存查询_',
          '入库管理V2',
          '医疗耗材验收',
          'UDI院内流转查询',
          '产品主码管理',
          '利用率',
          '基础数据管理',
          '出库管理',
          '库存管理',
          '调库主单-确认调库',
          '调库主单-提交调库',
          '科室目录',
          '在用目录',
          '中标目录',
          '申领指引'
        ];
        permission_group = permission_group.filter((res) => {
          return !blackList.includes(res.title);
        });

        //console.log(permission_group)

        //控制菜单显示区域
        const rightMenuList = [
          '/KSInventory/KSNewBatchReminder',
          '/KSInventory/KSExpirationReminder'
        ];
        this.NoticeMenuList = permission_group.filter((res) => {
          return rightMenuList.includes(res.component);
        });

        permission_group = permission_group.filter((res) => {
          return !rightMenuList.includes(res.component);
        });

        var ListCount = 11;
        var ListCount2 = Math.floor(permission_group.length / ListCount);
        var ListCount3 = permission_group.length % ListCount;
        var startCount = 0;
        var permission_group2 = [];

        // 主循环，用于处理完整的组
        for (var i = 0; i < ListCount2; i++) {
          permission_group2[i] = [];
          for (var j = 0; j < ListCount; j++) {
            permission_group2[i][j] = permission_group[startCount];
            startCount++;
          }
        }

        // 处理剩余的元素
        if (ListCount3 > 0) {
          var lastGroup = [];
          for (var k = 0; k < ListCount3; k++) {
            lastGroup[k] = permission_group[startCount];
            startCount++;
          }
          permission_group2.push(lastGroup);
        }

        this.MenuList = permission_group2;
      }
    },
    mounted() {
      //this.getSaleroomData();
      this.$bus.$on('handleCommand', () => {
        this.getSaleroomData();
        this.getLineChartData();
      });
    },
    beforeDestroy() {
      this.$bus.$off('handleCommand');
    },
    computed: {
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      },
      lineChartOption() {
        const months = [
          '一月',
          '二月',
          '三月',
          '四月',
          '五月',
          '六月',
          '七月',
          '八月',
          '九月',
          '十月',
          '十一月',
          '十二月'
        ];

        // 初始化数据结构，默认填充为 0 或者 null
        const initData = Array.from({ length: 12 }, () => ({
          TOTAL_MONEY: 0,
          PAST_TOTAL_MONEY: 0,
          MON_CHANGE_PERCENT: 0,
          YEAR_CHANGE_PERCENT: 0
        }));

        // 填充实际数据到对应的月份位置
        this.lineChartData.forEach((item) => {
          if (item.MONTH) {
            const monthIndex = this.$moment(item.MONTH, 'YYYY-MM').month(); // 使用 moment.js 解析月份并转换为索引
            initData[monthIndex].TOTAL_MONEY = item.TOTAL_MONEY;
          }
          if (item.PAST_MONTH) {
            const pastMonthIndex = this.$moment(
              item.PAST_MONTH,
              'YYYY-MM'
            ).month();
            initData[pastMonthIndex].PAST_TOTAL_MONEY = item.PAST_TOTAL_MONEY;
          }
        });

        // 计算同比和环比 计算环比时第一个月的上期默认为0，计算同比是需要考虑为0的情况
        for (let i = 0; i < 12; i++) {
          const current = initData[i].TOTAL_MONEY;
          const previous = initData[i].PAST_TOTAL_MONEY;
          const lastMonth = i > 0 ? initData[i - 1].TOTAL_MONEY : 0;

          const yoy = previous ? ((current - previous) / previous) * 100 : 0;
          const mom = lastMonth ? ((current - lastMonth) / lastMonth) * 100 : 0;

          initData[i].YEAR_CHANGE_PERCENT = yoy.toFixed(2);
          initData[i].MON_CHANGE_PERCENT = mom.toFixed(2);
        }

        const yoyChangePercentData = initData.map((d) => d.YEAR_CHANGE_PERCENT);
        const momChangePercentData = initData.map((d) => d.MON_CHANGE_PERCENT);

        return {
          title: {
            text: '消耗折线图',
            left: 'right',
            top: 'top'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['同比', '环比']
          },
          xAxis: [
            {
              type: 'category',
              data: months
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              type: 'line',
              name: '同比',
              data: yoyChangePercentData
            },
            {
              type: 'line',
              name: '环比',
              data: momChangePercentData
            }
          ]
        };
      },
      /* 配置 */
      saleChartOption() {
        const months = [
          '一月',
          '二月',
          '三月',
          '四月',
          '五月',
          '六月',
          '七月',
          '八月',
          '九月',
          '十月',
          '十一月',
          '十二月'
        ];

        // 初始化数据结构，默认填充为 0 或者 null
        const initData = Array.from({ length: 12 }, () => ({
          TOTAL_MONEY: 0,
          PAST_TOTAL_MONEY: 0
        }));

        // 填充实际数据到对应的月份位置
        this.saleroomData.forEach((item) => {
          if (item.MONTH) {
            const monthIndex = this.$moment(item.MONTH, 'YYYY-MM').month(); // 使用 moment.js 解析月份并转换为索引
            initData[monthIndex].TOTAL_MONEY = item.TOTAL_MONEY;
          }
          if (item.PAST_MONTH) {
            const pastMonthIndex = this.$moment(
              item.PAST_MONTH,
              'YYYY-MM'
            ).month();
            initData[pastMonthIndex].PAST_TOTAL_MONEY = item.PAST_TOTAL_MONEY;
          }
        });

        // 提取每个月的 TOTAL_MONEY 和 PAST_TOTAL_MONEY 数据
        const totalMoneyData = initData.map((d) => d.TOTAL_MONEY);
        const pastTotalMoneyData = initData.map((d) => d.PAST_TOTAL_MONEY);

        return {
          title: {
            text: '消耗统计柱状图',
            left: 'right',
            top: 'top'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['今年', '去年']
          },
          xAxis: [
            {
              type: 'category',
              data: months
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '今年',
              type: 'bar',
              data: totalMoneyData
            },
            {
              name: '去年',
              type: 'bar',
              data: pastTotalMoneyData
            }
          ]
        };
      }
    },
    created() {
      // this.getdatasource();
      this.permission_groupList();
      this.getSaleroomData();
      this.getLineChartData();
      // this.MenuList = this.$store.state.user.info.permission_group;
      /* 获取数据 */
    }
  };
</script>
