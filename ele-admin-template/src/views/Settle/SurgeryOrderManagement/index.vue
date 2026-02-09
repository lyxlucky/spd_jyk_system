<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form
        :model="searchForm"
        :inline="true"
        class="ele-form-search"
        size="mini"
        @keyup.enter.native="search"
      >
        <el-form-item label="手术地点">
          <el-select
            v-model="searchForm.SURGERY_LOCATION"
            placeholder="请选择手术地点"
            clearable
            filterable
            style="width: 150px"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="item in surgeryLocationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申请科室">
          <el-select
            v-model="searchForm.APPLY_DEPT_CODE"
            placeholder="请选择申请科室"
            clearable
            filterable
            style="width: 200px"
          >
            <el-option
              v-for="item in deptOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="手术单状态">
          <el-select
            v-model="searchForm.SURGERY_STATUS"
            placeholder="请选择手术单状态"
            clearable
            style="width: 150px"
          >
            <el-option label="全部" value="" />
            <!-- <el-option label="未开始" value="1" /> -->
            <el-option label="进行中" value="2" />
            <el-option label="已完成" value="3" />
            <!-- <el-option label="已暂停" value="4" /> -->
            <el-option label="已作废" value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="消耗状态">
          <el-select
            v-model="searchForm.CONSUME_STATUS"
            placeholder="请选择消耗状态"
            clearable
            style="width: 150px"
          >
            <el-option label="全部" value="" />
            <el-option label="消耗未确认" value="消耗未确认" />
            <el-option label="消耗已确认" value="消耗已确认" />
          </el-select>
        </el-form-item>
        <el-form-item label="提交HIS状态" v-if="false">
          <el-select
            v-model="searchForm.SUBMIT_HIS_STATUS"
            placeholder="请选择提交HIS状态"
            clearable
            style="width: 150px"
          >
            <el-option label="全部" value="" />
            <el-option label="未提交" value="未提交" />
            <el-option label="已提交" value="已提交" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否上传消耗单" v-if="false">
          <el-select
            v-model="searchForm.IS_UPLOAD_CONSUME"
            placeholder="请选择"
            clearable
            style="width: 150px"
          >
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="手术单号">
          <el-input
            v-model="searchForm.SURGERY_NO"
            placeholder="请输入手术单号"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="患者姓名">
          <el-input
            v-model="searchForm.PATIENT_NAME"
            placeholder="请输入患者姓名"
            clearable
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="住院号">
          <el-input
            v-model="searchForm.IN_HOSP_NO"
            placeholder="请输入住院号"
            clearable
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="手术计划" >
          <el-date-picker
            v-model="surgeryPlanDateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="手术时间">
          <el-date-picker
            v-model="surgeryTimeDateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="是否上传植入物单">
          <el-select
            v-model="searchForm.IS_UPLOAD_IMPLANT"
            placeholder="请选择"
            clearable
            style="width: 150px"
          >
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="病人科室">
          <el-input
            v-model="searchForm.PATIENT_DEPT"
            placeholder="请输入病人科室"
            clearable
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="创建人">
          <el-input
            v-model="searchForm.CREATOR"
            placeholder="请输入创建人"
            clearable
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="院内寄售耗材" v-if="false">
          <el-select
            v-model="searchForm.IS_HOSPITAL_CONSIGNMENT"
            placeholder="请选择"
            clearable
            style="width: 150px"
          >
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="跟台耗材">
          <el-select
            v-model="searchForm.IS_FOLLOW_STAGE"
            placeholder="请选择"
            clearable
            style="width: 150px"
          >
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="ele-btn-icon" icon="el-icon-search" @click="search">
            查询
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-refresh" class="ele-btn-icon" @click="reset">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" class="ele-btn-icon" @click="openCreateDialog">
            创建临时手术单
          </el-button>
        </el-form-item>
        <el-form-item v-if="false">
          <el-button
            type="primary"
            class="ele-btn-icon"
            :disabled="!currentMainRow"
            @click="handleSurgeryStart"
          >
            手术开始
          </el-button>
        </el-form-item>
        <el-form-item v-if="false">
          <el-button
            type="warning"
            class="ele-btn-icon"
            :disabled="!currentMainRow"
            @click="handleSurgeryPause"
          >
            手术暂停
          </el-button>
        </el-form-item>
        <el-form-item v-if="false">
          <el-button
            type="success"
            class="ele-btn-icon"
            :disabled="!currentMainRow"
            @click="handleSurgeryComplete"
          >
            手术完成
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="warning"
            class="ele-btn-icon"
            :disabled="!currentMainRow"
            @click="handleConfirmConsume"
          >
            确认消耗
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="info"
            class="ele-btn-icon"
            :disabled="!currentMainRow"
            @click="handleEditSurgery"
          >
            修改手术单
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="danger"
            class="ele-btn-icon"
            :disabled="!currentMainRow || (currentMainRow.IS_HIS_CREATE == 1)"
            @click="handleInvalidateSurgery"
          >
            手术单作废
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="info"
            class="ele-btn-icon"
            :disabled="!currentMainRow"
            @click="handlePrintConsumeOrder"
          >
            打印消耗单
          </el-button>
        </el-form-item>
        <el-form-item v-if="false">
          <el-button
            type="primary"
            class="ele-btn-icon"
            :disabled="!currentMainRow"
            @click="handleUploadConsumeOrder"
          >
            上传消耗单
          </el-button>
        </el-form-item>
        <el-form-item v-if="false">
          <el-button
            type="success"
            class="ele-btn-icon"
            :disabled="!currentMainRow"
            @click="handleViewConsumeOrder"
          >
            查看消耗单
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="ele-btn-icon"
            :disabled="!currentMainRow"
            @click="handleUploadImplantOrder"
          >
            上传植入物单
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="success"
            class="ele-btn-icon"
            :disabled="!currentMainRow"
            @click="handleViewImplantOrder"
          >
            查看植入物单
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 主表（手术单列表） -->
      <div>
        <vxe-table
          ref="mainTable"
          :data="mainTableData"
          :loading="mainTableLoading"
          border
          stripe
          size="mini"
          height="400"
          highlight-current-row
          resizable
          @current-change="onMainTableCurrentChange"
          @row-click="onMainTableRowClick"
        >
          <vxe-column type="seq" title="序号" width="60" align="center" />
          <vxe-column
            field="SURGERY_NO"
            title="手术单号"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="IN_HOSP_NO"
            title="住院号"
            min-width="120"
            show-overflow
          />
          <vxe-column
            field="PATIENT_NAME"
            title="患者姓名"
            width="120"
            align="center"
          />
          <vxe-column field="GENDER" title="性别" width="80" align="center" />
          <vxe-column field="AGE_STR" title="年龄" width="120" align="center" />
          <vxe-column
            field="DIAGNOSIS"
            title="诊断结果"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="SURGERY_LOCATION"
            title="手术地点"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="SURGERY_NAME"
            title="手术名称"
            min-width="200"
            show-overflow
          />
          <vxe-column
            field="SURGERY_STATUS"
            title="手术状态"
            width="120"
            align="center"
            :formatter="formatSurgeryStatus"
          />
          <vxe-column
            field="CHIEF_SURGEON"
            title="主刀医生"
            width="120"
            align="center"
          />
          <vxe-column
            field="APPLY_DEPT"
            title="主刀科室"
            min-width="120"
            show-overflow
            align="center"
          />
          <vxe-column
            v-if="false"
            field="SMART_CABINET1"
            title="智能柜"
            width="120"
            align="center"
          />
          <vxe-column
            field="APPLY_DEPT"
            title="申请科室"
            min-width="120"
            show-overflow
            align="center"
          />
          <vxe-column
            field="PATIENT_DEPT"
            title="病人所在科室"
            min-width="120"
            show-overflow
            align="center"
          />
          <vxe-column
            field="PLAN_SURGERY_DATE"
            title="计划手术日期"
            width="180"
            align="center"
            :formatter="formatDateTime"
          />
          <vxe-column
            field="ACTUAL_SURGERY_DATE"
            title="实际手术日期"
            width="180"
            align="center"
            :formatter="formatDateTime"
          />
          <vxe-column
            field="CHARGE_AMOUNT"
            title="收费金额"
            width="120"
            align="right"
            :formatter="formatPrice"
          />
          <vxe-column
            field="IS_CONSUME"
            title="消耗状态"
            width="120"
            align="center"
          >
            <template v-slot="{ row }">
              <el-tag v-if="row.IS_CONSUME == 1" type="success">已确认</el-tag>
              <el-tag v-else-if="row.IS_CONSUME == 0" type="danger">未确认</el-tag>
              <el-tag v-else type="warning">未知</el-tag>
            </template>
          </vxe-column>
          <vxe-column
            v-if="false"
            field="CHARGE_STATUS"
            title="收费状态"
            width="120"
            align="center"
          >
            <template v-slot="{ row }">
              <el-tag v-if="row.CHARGE_STATUS == 1" type="success">是</el-tag>
              <el-tag v-else type="danger">否</el-tag>
            </template>
        </vxe-column>
        </vxe-table>
        <!-- 主表分页 -->
        <vxe-pager
          :current-page="mainTablePage.page"
          :page-size="mainTablePage.size"
          :total="mainTablePage.total"
          :page-sizes="[10, 20, 50, 100]"
          :layouts="[
            'PrevJump',
            'PrevPage',
            'Number',
            'NextPage',
            'NextJump',
            'Sizes',
            'FullJump',
            'Total'
          ]"
          @page-change="onMainTablePageChange"
        />
      </div>

      <!-- 明细表1：已登记手术消耗品种 -->
      <div >
        <div style="display: flex;  margin-bottom: 8px; font-weight: bold; font-size: 14px">
          <div style=" margin-right: 10px; font-weight: bold; font-size: 14px">
            >>已登记手术消耗品种
          </div>

          <!-- 定数标签登记 -->
          <el-form :inline="true" size="mini" @keyup.enter.native="handleRegisterConsume">
            <el-form-item label="" style="margin-bottom: 0px">
              <el-input
                v-model="registerConsumeForm.LABEL"
                placeholder="请输入定数标签"
                clearable
                style="width: 220px"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                class="ele-btn-icon"
                icon="el-icon-check"
                :disabled="!currentMainRow"
                @click="handleRegisterConsume"
              >
                登记消耗
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                type="warning"
                class="ele-btn-icon"
                icon="el-icon-edit"
                :disabled="!currentMainRow || registeredTableCheckedCount === 0"
                @click="openBatchExecuteDeptDialog"
              >
                批量修改执行科室
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                type="success"
                class="ele-btn-icon"
                icon="el-icon-printer"
                :disabled="!currentMainRow || registeredTableCheckedCount === 0"
                :loading="reprintLabelLoading"
                @click="handleReprintLabel"
              >
                补打标签
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <vxe-table
          ref="registeredTable"
          :data="registeredTableData"
          :loading="registeredTableLoading"
          border
          stripe
          size="mini"
          height="300"
          resizable
          :checkbox-config="{ highlight: true }"
          @checkbox-change="onRegisteredTableCheckboxChange"
          @checkbox-all="onRegisteredTableCheckboxAll"
        >
          <vxe-column type="checkbox" width="50" align="center" />
          <vxe-column type="seq" title="序号" width="60" align="center" />
          <vxe-column
            field="ZX_DEPT"
            title="执行科室"
            min-width="120"
            show-overflow
          />
          <vxe-column
            field="LABEL_BARCODE"
            title="标签条码"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="IS_IMPLANT"
            title="是否植入类耗材"
            width="120"
            align="center"
          >
            <template v-slot="{ row }">
              <el-tag v-if="row.IS_IMPLANT == 1" type="success">是</el-tag>
              <el-tag v-else type="danger">否</el-tag>
            </template>
          </vxe-column>
          <vxe-column
            field="VARIETIE_NAME"
            title="品种名称"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="HOSPITAL_VARIETIE_NAME"
            title="医院品种名称"
            min-width="200"
            show-overflow
          />
          <vxe-column
            field="SPECIFICATION_OR_TYPE"
            title="规格型号"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="REGISTRATION_TIME"
            title="登记时间"
            width="180"
            align="center"
            :formatter="formatDateTime"
          />
          <vxe-column
            field="VARIETIE_CODE_NEW"
            title="品种编码"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="MANUFACTURER"
            title="厂家"
            min-width="150"
            show-overflow
          />
          <vxe-column field="IS_CONSUME" title="消耗状态" width="120" align="center">
            <template v-slot="{ row }">
              <el-tag v-if="row.IS_CONSUME == 1" type="success">已确认</el-tag>
              <el-tag v-else-if="row.IS_CONSUME == 0" type="danger">未确认</el-tag>
              <el-tag v-else type="warning">未知</el-tag>
            </template>
          </vxe-column>
          <vxe-column field="SOURCE_TYPE" title="登记来源" width="100" align="center">
            <template v-slot="{ row }">
              <span>{{ row.SOURCE_TYPE == 1 ? 'HIS登记' : '系统登记' }}</span>
            </template>
          </vxe-column>
          <vxe-column
            title="操作"
            width="100"
            align="center"
            fixed="right"
          >
            <template v-slot="{ row }">
              <el-button
                type="danger"
                size="mini"
                :disabled="!currentMainRow || (currentMainRow.CONSUME_STATUS == 1) || (row.SOURCE_TYPE == 1)"
                @click="handleDeleteConsumable(row)"
              >
                删除
              </el-button>
            </template>
          </vxe-column>
        </vxe-table>
        <!-- 明细表1分页 -->
        <vxe-pager
          :current-page="registeredTablePage.page"
          :page-size="registeredTablePage.size"
          :total="registeredTablePage.total"
          :page-sizes="[10, 20, 50, 100]"
          :layouts="[
            'PrevJump',
            'PrevPage',
            'Number',
            'NextPage',
            'NextJump',
            'Sizes',
            'FullJump',
            'Total'
          ]"
          @page-change="onRegisteredTablePageChange"
        />
      </div>

      <!-- 明细表2：领用未登记耗材 -->
      <div v-if="false">
        <div style="margin-bottom: 10px; font-weight: bold; font-size: 14px">
          >>领用未登记耗材
        </div>
        <!-- 筛选条件 -->
          <el-form :inline="true" size="mini">
            <el-form-item label="筛选条件">
              <el-select
                v-model="unregisteredFilter.FILTER_TYPE"
                placeholder="请选择"
                clearable
                style="width: 200px"
                @change="onUnregisteredFilterChange"
              >
                <el-option label="全部" value="" />
                <el-option label="院内、寄售耗材" value="0" />
                <el-option label="跟台耗材" value="1" />
              </el-select>
            </el-form-item>
          </el-form>
        <vxe-table
          ref="unregisteredTable"
          :data="unregisteredTableData"
          :loading="unregisteredTableLoading"
          border
          stripe
          size="mini"
          height="300"
          resizable
        >
          <vxe-column type="seq" title="序号" width="60" align="center" />
          <vxe-column
            field="SOURCE"
            title="来源"
            width="120"
            align="center"
          />
          <vxe-column
            field="LABEL_BARCODE"
            title="标签条码"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="VARIETIE_NAME"
            title="品种名称"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="GENERIC_NAME"
            title="通用名"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="SPECIFICATION_OR_TYPE"
            title="规格型号"
            min-width="150"
            show-overflow
          />
          <vxe-column
            field="COLLECTION_DATE"
            title="领用日期"
            width="120"
            align="center"
            :formatter="formatDate"
          />
          <vxe-column
            field="QUANTITY"
            title="数量"
            width="100"
            align="right"
          />
          <vxe-column field="UNIT" title="单位" width="80" align="center" />
          <vxe-column
            field="UNIT_PRICE_WITH_TAX"
            title="含税单价"
            width="120"
            align="right"
            :formatter="formatPrice"
          />
          <vxe-column
            field="AMOUNT_WITH_TAX"
            title="含税金额"
            width="120"
            align="right"
            :formatter="formatPrice"
          />
          <vxe-column
            field="DEPT"
            title="科室"
            min-width="120"
            show-overflow
          />
        </vxe-table>
        <!-- 明细表2分页 -->
        <vxe-pager
          :current-page="unregisteredTablePage.page"
          :page-size="unregisteredTablePage.size"
          :total="unregisteredTablePage.total"
          :page-sizes="[10, 20, 50, 100]"
          :layouts="[
            'PrevJump',
            'PrevPage',
            'Number',
            'NextPage',
            'NextJump',
            'Sizes',
            'FullJump',
            'Total'
          ]"
          @page-change="onUnregisteredTablePageChange"
        />
      </div>
    </el-card>

    <!-- 创建/编辑手术单对话框 -->
    <el-dialog
      :title="isEditMode ? '修改手术单' : '创建临时手术单'"
      :visible.sync="surgeryDialogVisible"
      width="75%"
      @close="closeSurgeryDialog"
    >
      <el-form
        ref="surgeryForm"
        :model="surgeryFormData"
        :rules="surgeryFormRules"
        label-width="130px"
        size="small"
      >
        <!-- 手术信息模块 -->
        <div class="form-section">
          <div class="section-title">手术信息</div>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="手术地点" prop="SURGERY_LOCATION">
                <el-select
                  v-model="surgeryFormData.SURGERY_LOCATION"
                  placeholder="请选择手术地点"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in surgeryLocationOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="手术单号" prop="SURGERY_NO">
                <el-input
                  v-model="surgeryFormData.SURGERY_NO"
                  placeholder="请输入手术单号"
                  :disabled="isEditMode"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计划时间" prop="PLAN_SURGERY_DATE">
                <el-date-picker
                  v-model="surgeryFormData.PLAN_SURGERY_DATE"
                  type="date"
                  placeholder="请选择计划时间"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="手术类型" prop="SURGERY_TYPE">
                <el-input v-model="surgeryFormData.SURGERY_TYPE" placeholder="请输入手术类型" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="手术名称" prop="SURGERY_NAME">
                <el-input v-model="surgeryFormData.SURGERY_NAME" placeholder="请输入手术名称" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="手术台" prop="SURGERY_TABLE">
                <el-input v-model="surgeryFormData.SURGERY_TABLE" placeholder="请输入手术台" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="住院号" prop="IN_HOSP_NO">
                <el-input v-model="surgeryFormData.IN_HOSP_NO" placeholder="请输入住院号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="手术标识" prop="SURGERY_FLAG">
                <el-input v-model="surgeryFormData.SURGERY_FLAG" placeholder="请输入手术标识" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="手术分组" prop="SURGERY_GROUP">
                <el-input v-model="surgeryFormData.SURGERY_GROUP" placeholder="请输入手术分组" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 患者信息模块 -->
        <div class="form-section">
          <div class="section-title">患者信息</div>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="姓名" prop="PATIENT_NAME">
                <el-input v-model="surgeryFormData.PATIENT_NAME" placeholder="请输入患者姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="年龄">
                <el-input :value="surgeryFormData.AGE_STR" placeholder="-" readonly />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别" prop="GENDER">
                <el-select v-model="surgeryFormData.GENDER" placeholder="请选择性别" style="width: 100%">
                  <el-option label="男" value="男" />
                  <el-option label="女" value="女" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="所在科室" prop="PATIENT_DEPT_CODE">
                <el-select
                  filterable
                  v-model="surgeryFormData.PATIENT_DEPT_CODE"
                  placeholder="请选择所在科室"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in deptOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="HIS住院流水号" prop="IN_HOSP_NO">
                <el-input v-model="surgeryFormData.IN_HOSP_NO" placeholder="请输入HIS住院流水号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="床号" prop="BED_NUMBER">
                <el-input v-model="surgeryFormData.BED_NUMBER" placeholder="请输入床号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="诊断结果" prop="DIAGNOSIS">
                <el-input
                  v-model="surgeryFormData.DIAGNOSIS"
                  placeholder="请输入诊断结果"
                  type="textarea"
                  :rows="2"
                  readonly
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 主刀信息模块 -->
        <div class="form-section">
          <div class="section-title">主刀信息</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="主刀科室" prop="SURGEON_DEPT_CODE">
                <el-select
                  filterable
                  v-model="surgeryFormData.SURGEON_DEPT_CODE"
                  placeholder="请选择主刀科室"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in deptOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="主刀医生" prop="CHIEF_SURGEON">
                <el-input
                  v-model="surgeryFormData.CHIEF_SURGEON"
                  placeholder="请输入主刀医生"
                  style="width: 100%"
                  readonly
                />
<!--                <el-select-->
<!--                  v-model="surgeryFormData.CHIEF_SURGEON"-->
<!--                  placeholder="请选择主刀医生"-->
<!--                  style="width: 100%"-->
<!--                  @change="onChiefSurgeonChange"-->
<!--                >-->
<!--                  <el-option-->
<!--                    v-for="item in chiefSurgeonOptions"-->
<!--                    :key="item.no"-->
<!--                    :label="item.name"-->
<!--                    :value="item.name"-->
<!--                  />-->
<!--                </el-select>-->
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeSurgeryDialog">取 消</el-button>
        <el-button type="primary" @click="saveSurgery" :loading="surgeryDialogLoading">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 批量修改执行科室 -->
    <el-dialog
      title="批量修改执行科室"
      :visible.sync="batchExecuteDeptDialogVisible"
      width="420px"
      append-to-body
    >
      <el-form label-width="90px" size="small">
        <el-form-item label="执行科室">
          <el-select
            v-model="batchExecuteDeptCode"
            placeholder="请选择执行科室"
            clearable
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="item in deptOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeBatchExecuteDeptDialog">取 消</el-button>
        <el-button type="primary" @click="submitBatchUpdateExecuteDept" :loading="batchExecuteDeptLoading">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSurgeryOrderHzInfo,
  getRegisteredConsumablesInfo,
  getUnregisteredConsumablesInfo,
  addSurgeryOrder,
  updateSurgeryOrder,
  updateSurgeryStatus,
  invalidateSurgeryOrder,
  getAllSurgeryLocations,
  getAllApplyDepartments,
  getSurgeryList,
  getSurgeryById,
  addSurgeryConsumable,
  uploadImplantForm,
  getImplantForm,
  confirmConsumption,
  deleteSurgeryConsumable,
  batchUpdateExecuteDept,
  printGtDetail
} from '@/api/Settle/SurgeryOrderManagement';
import { API_BASE_URL, TOKEN_STORE_NAME } from '@/config/setting';

export default {
  name: 'SurgeryOrderManagement',
  data() {
    return {
      // 手术状态字典
      surgeryStatusDict: {
        '1': '未开始',
        '2': '进行中',
        '3': '已完成',
        '4': '已暂停',
        '5': '已作废'
      },
      // 搜索表单
      searchForm: {
        SURGERY_LOCATION: '',
        APPLY_DEPT_CODE: '',
        SURGERY_STATUS: '',
        CONSUME_STATUS: '',
        SURGERY_NO: '',
        PATIENT_NAME: '',
        IN_HOSP_NO: '',
        PLAN_SURGERY_DATE_START: '',
        PLAN_SURGERY_DATE_END: '',
        ACTUAL_SURGERY_DATE_START: '',
        ACTUAL_SURGERY_DATE_END: '',
        CHIEF_SURGEON: '',
        IS_UPLOAD_IMPLANT: '',
        IS_FOLLOW_STAGE: '',
        CREATOR: '',
      },
      // 日期范围
      surgeryPlanDateRange: [],
      surgeryTimeDateRange: [],
      // 选项数据
      surgeryLocationOptions: [],
      deptOptions: [],
      // 主表数据
      mainTableData: [],
      mainTableLoading: false,
      mainTablePage: {
        page: 1,
        size: 20,
        total: 0
      },
      currentMainRow: null, // 当前选中的主表行
      // 明细表1：已登记手术消耗品种
      registeredTableData: [],
      registeredTableLoading: false,
      registeredTablePage: {
        page: 1,
        size: 100,
        total: 0
      },
      batchExecuteDeptCode: '',
      batchExecuteDeptDialogVisible: false,
      batchExecuteDeptLoading: false,
      reprintLabelLoading: false,
      registeredTableCheckedCount: 0,
      // 明细表2：领用未登记耗材
      unregisteredTableData: [],
      unregisteredTableLoading: false,
      unregisteredTablePage: {
        page: 1,
        size: 20,
        total: 0
      },
      // 明细表2筛选条件
      unregisteredFilter: {
        FILTER_TYPE: ''
      },
      // 明细表2：定数标签登记表单
      registerConsumeForm: {
        LABEL: ''
      },
      // 手术单对话框
      surgeryDialogVisible: false,
      surgeryDialogLoading: false,
      isEditMode: false,
      surgeryFormData: {
        // 手术信息模块
        SURGERY_LOCATION: '',
        SURGERY_NO: '',
        PLAN_SURGERY_DATE: '',
        SURGERY_TYPE: '',
        SURGERY_NAME: '',
        SURGERY_TABLE: '',
        HOSPITALIZATION_NUMBER: '',
        SURGERY_FLAG: '',
        SURGERY_GROUP: '',
        // 患者信息模块
        PATIENT_NAME: '',
        AGE_STR: '',
        GENDER: '',
        PATIENT_DEPT: '',
        PATIENT_DEPT_CODE: '',
        IN_HOSP_NO: '',
        BED_NUMBER: '',
        DIAGNOSIS: '',
        // 主刀信息模块
        SURGEON_DEPT: '',
        SURGEON_DEPT_CODE: '',
        CHIEF_SURGEON: '',
        CHIEF_SURGEON_NO: ''
      },
      surgeryFormRules: {
        // 手术信息必填
        SURGERY_LOCATION: [{ required: true, message: '请选择手术地点', trigger: 'change' }],
        SURGERY_NO: [{ required: true, message: '请输入手术单号', trigger: 'blur' }],
        // 患者信息必填
        PATIENT_NAME: [{ required: true, message: '请输入患者姓名', trigger: 'blur' }],
        PATIENT_DEPT_CODE: [{ required: true, message: '请选择所在科室', trigger: 'change' }],
        // 主刀信息必填
        SURGEON_DEPT: [{ required: true, message: '请选择主刀科室', trigger: 'change' }]
      }
    };
  },
  methods: {
    // getById 可能不返回 AGE_STR，根据 AGE（出生日期）计算显示
    ageStrFromBirthDate(dateVal) {
      if (dateVal === undefined || dateVal === null || dateVal === '') return '';
      const s = String(dateVal).trim().substring(0, 10);
      const birth = new Date(s);
      if (isNaN(birth.getTime())) return '';
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      return age >= 0 ? `${age}岁` : '';
    },
    // 加载手术地点和申请科室选项
    async loadOptions() {
      try {
        // 加载手术地点
        const locationsRes = await getAllSurgeryLocations();
        if (locationsRes.code === 200 && locationsRes.result) {
          this.surgeryLocationOptions = locationsRes.result.map(item => ({
            label: item.LOCATION_NAME,
            value: item.LOCATION_NAME
          }));
        }

        // 加载申请科室
        const deptRes = await getAllApplyDepartments();
        if (deptRes.code === 200 && deptRes.result) {
          this.deptOptions = deptRes.result.map(item => ({
            label: item.APPLY_DEPT_NAME,
            value: item.APPLY_DEPT_CODE,
          }));
        }
      } catch (error) {
        console.error('加载选项数据失败', error);
      }
    },
    // 搜索
    search() {
      // 处理手术计划日期范围
      if (
        this.surgeryPlanDateRange &&
        this.surgeryPlanDateRange.length === 2
      ) {
        this.searchForm.PLAN_SURGERY_DATE_START = this.surgeryPlanDateRange[0];
        this.searchForm.PLAN_SURGERY_DATE_END = this.surgeryPlanDateRange[1];
      } else {
        this.searchForm.PLAN_SURGERY_DATE_START = '';
        this.searchForm.PLAN_SURGERY_DATE_END = '';
      }
      // 处理手术时间日期范围
      if (
        this.surgeryTimeDateRange &&
        this.surgeryTimeDateRange.length === 2
      ) {
        this.searchForm.ACTUAL_SURGERY_DATE_START = this.surgeryTimeDateRange[0];
        this.searchForm.ACTUAL_SURGERY_DATE_END = this.surgeryTimeDateRange[1];
      } else {
        this.searchForm.ACTUAL_SURGERY_DATE_START = '';
        this.searchForm.ACTUAL_SURGERY_DATE_END = '';
      }
      this.mainTablePage.page = 1;
      this.loadMainTableData();
    },
    // 重置
    reset() {
      this.searchForm = {
        SURGERY_LOCATION: '',
        APPLY_DEPT_CODE: '',
        SURGERY_STATUS: '',
        CONSUME_STATUS: '',
        SURGERY_NO: '',
        PATIENT_NAME: '',
        IN_HOSP_NO: '',
        PLAN_SURGERY_DATE_START: '',
        PLAN_SURGERY_DATE_END: '',
        ACTUAL_SURGERY_DATE_START: '',
        ACTUAL_SURGERY_DATE_END: '',
        CHIEF_SURGEON: '',
        IS_UPLOAD_IMPLANT: '',
        IS_FOLLOW_STAGE: '',
        CREATOR: '',
      };
      this.surgeryPlanDateRange = [];
      this.surgeryTimeDateRange = [];
      this.mainTablePage.page = 1;
      this.loadMainTableData();
    },
    // 加载主表数据
    async loadMainTableData() {
      this.mainTableLoading = true;
      try {
        const params = {
          ...this.searchForm,
          CREATE_MAN: this.searchForm.CREATOR, // 映射创建人字段
          page: this.mainTablePage.page,
          size: this.mainTablePage.size
        };
        const res = await getSurgeryList(params);
        if (res.code === 200) {
          this.mainTableData = res.result || [];
          this.mainTablePage.total = res.total || 0;
          // 查询成功后，清空下面两个表格的内容
          this.currentMainRow = null;
          this.registeredTableData = [];
          this.registeredTablePage.total = 0;
          this.registeredTablePage.page = 1;
          this.unregisteredTableData = [];
          this.unregisteredTablePage.total = 0;
          this.unregisteredTablePage.page = 1;
          // 重置筛选条件
          this.unregisteredFilter = {
            FILTER_TYPE: ''
          };
        } else {
          this.$message.error(res.msg || '加载数据失败');
        }
      } catch (error) {
        this.$message.error(error.message || '加载数据失败');
      } finally {
        this.mainTableLoading = false;
        this.$nextTick(() => this.clearRegisteredTableCheckbox());
      }
    },
    // 加载已登记手术消耗品种数据
    async loadRegisteredTableData() {
      if (!this.currentMainRow || !this.currentMainRow.SURGERY_NO) {
        this.registeredTableData = [];
        this.registeredTablePage.total = 0;
        this.$nextTick(() => this.clearRegisteredTableCheckbox());
        return;
      }
      this.registeredTableLoading = true;
      try {
        const params = {
          SURGERY_NO: this.currentMainRow.SURGERY_NO,
          ID: this.currentMainRow.ID,
          page: this.registeredTablePage.page,
          size: this.registeredTablePage.size
        };
        const res = await getRegisteredConsumablesInfo(params);
        if (res.code === 200) {
          this.registeredTableData = res.result || [];
          this.registeredTablePage.total = res.total || 0;
        } else {
          this.$message.error(res.msg || '加载已登记耗材数据失败');
        }
      } catch (error) {
        this.$message.error(error.message || '加载已登记耗材数据失败');
      } finally {
        this.registeredTableLoading = false;
        this.$nextTick(() => this.clearRegisteredTableCheckbox());
      }
    },
    // 加载领用未登记耗材数据
    async loadUnregisteredTableData() {
      if (!this.currentMainRow || !this.currentMainRow.SURGERY_NO) {
        this.unregisteredTableData = [];
        this.unregisteredTablePage.total = 0;
        return;
      }
      this.unregisteredTableLoading = true;
      try {
        const params = {
          SURGERY_NO: this.currentMainRow.SURGERY_NO,
          ID: this.currentMainRow.ID,
          FILTER_TYPE: this.unregisteredFilter.FILTER_TYPE || '',
          page: this.unregisteredTablePage.page,
          size: this.unregisteredTablePage.size
        };
        const res = await getUnregisteredConsumablesInfo(params);
        if (res.code === 200) {
          this.unregisteredTableData = res.result || [];
          this.unregisteredTablePage.total = res.total || 0;
        } else {
          this.$message.error(res.msg || '加载未登记耗材数据失败');
        }
      } catch (error) {
        this.$message.error(error.message || '加载未登记耗材数据失败');
      } finally {
        this.unregisteredTableLoading = false;
      }
    },
    // 明细表2筛选条件变化
    onUnregisteredFilterChange() {
      this.unregisteredTablePage.page = 1;
      this.loadUnregisteredTableData();
    },
    // 主表分页变化
    onMainTablePageChange({ currentPage, pageSize }) {
      this.mainTablePage.page = currentPage;
      this.mainTablePage.size = pageSize;
      this.loadMainTableData();
    },
    // 已登记表分页变化
    onRegisteredTablePageChange({ currentPage, pageSize }) {
      this.registeredTablePage.page = currentPage;
      this.registeredTablePage.size = pageSize;
      this.loadRegisteredTableData();
    },
    onRegisteredTableCheckboxChange({ records }) {
      this.registeredTableCheckedCount = (records && records.length) || 0;
    },
    onRegisteredTableCheckboxAll({ records }) {
      this.registeredTableCheckedCount = (records && records.length) || 0;
    },
    clearRegisteredTableCheckbox() {
      this.registeredTableCheckedCount = 0;
      if (this.$refs.registeredTable && typeof this.$refs.registeredTable.clearCheckboxRow === 'function') {
        this.$refs.registeredTable.clearCheckboxRow();
      }
    },
    openBatchExecuteDeptDialog() {
      if (!this.currentMainRow || !this.currentMainRow.SURGERY_NO) {
        this.$message.warning('请先选择手术单');
        return;
      }
      const rows = this.$refs.registeredTable ? this.$refs.registeredTable.getCheckboxRecords() : [];
      if (!rows || rows.length === 0) {
        this.$message.warning('请勾选要修改的耗材记录');
        return;
      }
      this.batchExecuteDeptCode = '';
      this.batchExecuteDeptDialogVisible = true;
    },
    closeBatchExecuteDeptDialog() {
      this.batchExecuteDeptDialogVisible = false;
      this.batchExecuteDeptCode = '';
    },
    async submitBatchUpdateExecuteDept() {
      if (!this.batchExecuteDeptCode) {
        this.$message.warning('请选择执行科室');
        return;
      }
      const rows = this.$refs.registeredTable ? this.$refs.registeredTable.getCheckboxRecords() : [];
      if (!rows || rows.length === 0) {
        this.$message.warning('请勾选要修改的耗材记录');
        return;
      }
      this.batchExecuteDeptLoading = true;
      try {
        const items = rows.map(r => ({ ID: r.ID, SOURCE_TYPE: r.SOURCE_TYPE }));
        const res = await batchUpdateExecuteDept({
          SURGERY_NO: this.currentMainRow.SURGERY_NO,
          items,
          DEPT_CODE: this.batchExecuteDeptCode
        });
        if (res.code === 200) {
          this.$message.success(res.msg || '修改成功');
          this.closeBatchExecuteDeptDialog();
          this.loadRegisteredTableData();
        } else {
          this.$message.error(res.msg || '修改失败');
        }
      } catch (error) {
        this.$message.error(error.message || '修改失败');
      } finally {
        this.batchExecuteDeptLoading = false;
      }
    },
    async handleReprintLabel() {
      if (!this.currentMainRow || !this.currentMainRow.SURGERY_NO) {
        this.$message.warning('请先选择手术单');
        return;
      }
      const rows = this.$refs.registeredTable ? this.$refs.registeredTable.getCheckboxRecords() : [];
      if (!rows || rows.length === 0) {
        this.$message.warning('请勾选要补打标签的耗材记录');
        return;
      }
      const detail = rows.map(r => ({
        DEF_NO_PKG_CODE: r.LABEL_BARCODE || ''
      })).filter(d => d.DEF_NO_PKG_CODE);
      if (detail.length === 0) {
        this.$message.warning('所选记录无有效标签条码');
        return;
      }
      this.reprintLabelLoading = true;
      try {
        const res = await printGtDetail({
          SURGERY_NO: this.currentMainRow.SURGERY_NO,
          Detail: detail
        });
        const blob = res.data;
        if (blob.type && blob.type.indexOf('application/json') !== -1) {
          const text = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsText(blob);
          });
          const json = JSON.parse(text);
          this.$message.error(json.msg || json.message || '补打标签失败');
          return;
        }
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => window.URL.revokeObjectURL(url), 60000);
      } catch (error) {
        this.$message.error(error.message || '补打标签失败');
      } finally {
        this.reprintLabelLoading = false;
      }
    },
    // 未登记表分页变化
    onUnregisteredTablePageChange({ currentPage, pageSize }) {
      this.unregisteredTablePage.page = currentPage;
      this.unregisteredTablePage.size = pageSize;
      this.loadUnregisteredTableData();
    },
    // 主表当前行变化
    onMainTableCurrentChange({ row }) {
      this.currentMainRow = row;
      this.registeredTablePage.page = 1;
      this.unregisteredTablePage.page = 1;
      // 重置筛选条件
      this.unregisteredFilter = {
        FILTER_TYPE: ''
      };
      this.loadRegisteredTableData();
      this.loadUnregisteredTableData();
    },
    // 主表行点击
    onMainTableRowClick({ row }) {
      if (!row) return;
      // 设置当前行
      this.currentMainRow = row;
      this.registeredTablePage.page = 1;
      this.unregisteredTablePage.page = 1;
      // 重置筛选条件
      this.unregisteredFilter = {
        FILTER_TYPE: ''
      };
      // 设置当前行为选中状态（触发高亮）
      this.$nextTick(() => {
        if (this.$refs.mainTable) {
          this.$refs.mainTable.setCurrentRow(row);
        }
      });
      // 加载明细表数据
      this.loadRegisteredTableData();
      this.loadUnregisteredTableData();
    },
    // 格式化手术状态
    formatSurgeryStatus({ cellValue }) {
      if (!cellValue) {
        return '';
      }
      return this.surgeryStatusDict[String(cellValue)] || cellValue;
    },
    // 格式化价格
    formatPrice({ cellValue }) {
      if (cellValue == null || cellValue === '') {
        return '';
      }
      return Number(cellValue).toFixed(2);
    },
    // 格式化日期（YYYY-MM-DD）
    formatDate({ cellValue }) {
      if (!cellValue) {
        return '';
      }
      try {
        return this.$moment(cellValue).format('YYYY-MM-DD');
      } catch (error) {
        return cellValue || '';
      }
    },
    // 格式化日期时间（YYYY-MM-DD HH:mm:ss）
    formatDateTime({ cellValue }) {
      if (!cellValue) {
        return '';
      }
      try {
        return this.$moment(cellValue).format('YYYY-MM-DD HH:mm:ss');
      } catch (error) {
        return cellValue || '';
      }
    },
    // 打开创建手术单对话框
    openCreateDialog() {
      this.isEditMode = false;
      this.surgeryFormData = {
        // 手术信息模块
        SURGERY_LOCATION: '',
        SURGERY_NO: '',
        PLAN_SURGERY_DATE: '',
        SURGERY_TYPE: '',
        SURGERY_NAME: '',
        SURGERY_TABLE: '',
        HOSPITALIZATION_NUMBER: '',
        SURGERY_FLAG: '',
        SURGERY_GROUP: '',
        // 患者信息模块
        PATIENT_NAME: '',
        AGE_STR: '',
        GENDER: '',
        PATIENT_DEPT: '',
        PATIENT_DEPT_CODE: '',
        IN_HOSP_NO: '',
        BED_NUMBER: '',
        DIAGNOSIS: '',
        // 主刀信息模块
        SURGEON_DEPT: '',
        SURGEON_DEPT_CODE: '',
        CHIEF_SURGEON: '',
        CHIEF_SURGEON_NO: ''
      };
      this.$nextTick(() => {
        this.$refs.surgeryForm.clearValidate();
      });
      this.surgeryDialogVisible = true;
    },
    // 打开编辑手术单对话框（调用接口获取最新手术单信息）
    async openEditDialog() {
      if (!this.currentMainRow) {
        return;
      }
      this.isEditMode = true;
      this.surgeryDialogLoading = true;
      this.surgeryDialogVisible = true;
      try {
        const res = await getSurgeryById(this.currentMainRow.ID);
        const row = res.result || res.data || res;
        this.surgeryFormData = {
          ID: row.ID,
          SURGERY_LOCATION: row.SURGERY_LOCATION || '',
          SURGERY_NO: row.SURGERY_NO || '',
          PLAN_SURGERY_DATE: row.PLAN_SURGERY_DATE || '',
          SURGERY_TYPE: row.SURGERY_TYPE || '',
          SURGERY_NAME: row.SURGERY_NAME || '',
          SURGERY_TABLE: row.SURGERY_TABLE || '',
          HOSPITALIZATION_NUMBER: row.HOSPITALIZATION_NUMBER || '',
          SURGERY_FLAG: row.SURGERY_FLAG || '',
          SURGERY_GROUP: row.SURGERY_GROUP || '',
          PATIENT_NAME: row.PATIENT_NAME || '',
          AGE: row.AGE || '',
          AGE_STR: row.AGE_STR || this.ageStrFromBirthDate(row.AGE) || '',
          GENDER: row.GENDER || '',
          PATIENT_DEPT: row.PATIENT_DEPT || '',
          PATIENT_DEPT_CODE: row.PATIENT_DEPT_CODE || '',
          IN_HOSP_NO: row.IN_HOSP_NO || '',
          BED_NUMBER: row.BED_NUMBER || '',
          DIAGNOSIS: row.DIAGNOSIS || '',
          SURGEON_DEPT: row.SURGEON_DEPT || '',
          SURGEON_DEPT_CODE: row.SURGEON_DEPT_CODE || '',
          CHIEF_SURGEON: row.CHIEF_SURGEON || '',
          CHIEF_SURGEON_NO: row.CHIEF_SURGEON_NO || ''
        };
        this.$nextTick(() => {
          if (this.$refs.surgeryForm) {
            this.$refs.surgeryForm.clearValidate();
          }
        });
      } catch (error) {
        this.$message.error(error.message || '获取手术单详情失败');
        this.surgeryDialogVisible = false;
      } finally {
        this.surgeryDialogLoading = false;
      }
    },
    // 关闭对话框
    closeSurgeryDialog() {
      this.surgeryDialogVisible = false;
      if (this.$refs.surgeryForm) {
        this.$refs.surgeryForm.resetFields();
      }
    },
    // 保存手术单
    saveSurgery() {
      this.$refs.surgeryForm.validate(async (valid) => {
        if (!valid) {
          return;
        }
        this.surgeryDialogLoading = true;
        try {
          let res;
          if (this.isEditMode) {
            res = await updateSurgeryOrder(this.surgeryFormData);
          } else {
            res = await addSurgeryOrder(this.surgeryFormData);
          }
          if (res.code === 200) {
            this.$message.success(this.isEditMode ? '修改成功' : '创建成功');
            this.closeSurgeryDialog();
            this.loadMainTableData();
          } else {
            this.$message.error(res.msg || '操作失败');
          }
        } catch (error) {
          this.$message.error(error.message || '操作失败');
        } finally {
          this.surgeryDialogLoading = false;
        }
      });
    },
    // 手术开始
    async handleSurgeryStart() {
      if (!this.currentMainRow) {
        this.$message.warning('请先选择手术单');
        return;
      }
      this.$confirm('确认手术开始吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await updateSurgeryStatus({
            ID: this.currentMainRow.ID,
            SURGERY_STATUS: 2 // 2为进行中
          });
          if (res.code === 200) {
            this.$message.success('手术开始成功');
            this.loadMainTableData();
          } else {
            this.$message.error(res.msg || '操作失败');
          }
        } catch (error) {
          this.$message.error(error.message || '操作失败');
        }
      }).catch(() => {});
    },
    // 手术完成
    async handleSurgeryComplete() {
      if (!this.currentMainRow) {
        this.$message.warning('请先选择手术单');
        return;
      }
      this.$confirm('确认手术完成吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await updateSurgeryStatus({
            ID: this.currentMainRow.ID,
            SURGERY_STATUS: 3 // 3为已完成
          });
          if (res.code === 200) {
            this.$message.success('手术完成成功');
            this.loadMainTableData();
          } else {
            this.$message.error(res.msg || '操作失败');
          }
        } catch (error) {
          this.$message.error(error.message || '操作失败');
        }
      }).catch(() => {});
    },
    // 确认消耗
    async handleConfirmConsume() {
      if (!this.currentMainRow) {
        this.$message.warning('请先选择手术单');
        return;
      }
      this.$confirm('确认消耗吗?确认后将先标记手术单为完成状态，然后更新手术单和耗材明细的消耗状态', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await confirmConsumption({
            SURGERY_ID: this.currentMainRow.ID,
            SURGERY_NO: this.currentMainRow.SURGERY_NO
          });
          if (res.code === 200) {
            this.$message.success(res.msg || '消耗确认成功');
            this.loadMainTableData();
            this.loadRegisteredTableData();
          } else {
            this.$message.error(res.msg || '操作失败');
          }
        } catch (error) {
          this.$message.error(error.message || '操作失败');
        }
      }).catch(() => {});
    },
    // 手术暂停
    async handleSurgeryPause() {
      if (!this.currentMainRow) {
        this.$message.warning('请先选择手术单');
        return;
      }
      this.$confirm('确认暂停手术吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await updateSurgeryStatus({
            ID: this.currentMainRow.ID,
            SURGERY_STATUS: 4 // 4为已暂停
          });
          if (res.code === 200) {
            this.$message.success('手术暂停成功');
            this.loadMainTableData();
          } else {
            this.$message.error(res.msg || '操作失败');
          }
        } catch (error) {
          this.$message.error(error.message || '操作失败');
        }
      }).catch(() => {});
    },
    // 修改手术单
    handleEditSurgery() {
      if (!this.currentMainRow) {
        this.$message.warning('请先选择手术单');
        return;
      }
      this.openEditDialog();
    },
    // 手术单作废
    async handleInvalidateSurgery() {
      if (!this.currentMainRow) {
        this.$message.warning('请先选择手术单');
        return;
      }
      if (this.currentMainRow.IS_HIS_CREATE == 1) {
        this.$message.warning('HIS创建的手术单不允许作废');
        return;
      }
      this.$confirm('确认作废该手术单吗? 此操作不可恢复', '危险警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async () => {
        try {
          const res = await updateSurgeryStatus({
            ID: this.currentMainRow.ID,
            SURGERY_STATUS: 5 // 5为已作废
          });
          if (res.code === 200) {
            this.$message.success('作废成功');
            this.loadMainTableData();
          } else {
            this.$message.error(res.msg || '操作失败');
          }
        } catch (error) {
          this.$message.error(error.message || '操作失败');
        }
      }).catch(() => {});
    },
    // 登记消耗（定数标签）
    async handleRegisterConsume() {
      if (!this.currentMainRow) {
        this.$message.warning('请先选择手术单');
        return;
      }
      if (!this.registerConsumeForm.LABEL) {
        this.$message.warning('请输入定数标签');
        return;
      }
      // 检查手术单是否已确认消耗
      if (this.currentMainRow.CONSUME_STATUS == 1) {
        this.$message.warning('手术单已确认消耗，不允许登记');
        return;
      }

      try {
        const res = await addSurgeryConsumable({
          SURGERY_ID: this.currentMainRow.ID,
          SURGERY_NO: this.currentMainRow.SURGERY_NO,
          BARCODE: this.registerConsumeForm.LABEL
        });

        if (res.code === 200) {
          this.$message.success(res.msg || '登记成功');
          this.registerConsumeForm.LABEL = ''; // 清空输入
          this.loadRegisteredTableData(); // 刷新列表
        } else {
          this.$message.error(res.msg || '登记失败');
        }
      } catch (error) {
        this.$message.error(error.message || '登记失败');
      }
    },
    // 删除已登记的耗材
    async handleDeleteConsumable(row) {
      if (!row || !row.ID) {
        this.$message.warning('请选择要删除的耗材');
        return;
      }
      if (!this.currentMainRow) {
        this.$message.warning('请先选择手术单');
        return;
      }
      // 检查手术单是否已确认消耗
      if (this.currentMainRow.CONSUME_STATUS == 1) {
        this.$message.warning('手术单已确认消耗，不允许删除');
        return;
      }

      this.$confirm('确认删除该耗材吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await deleteSurgeryConsumable({
            ID: row.ID
          });
          if (res.code === 200) {
            this.$message.success(res.msg || '删除成功');
            this.loadRegisteredTableData(); // 刷新列表
          } else {
            this.$message.error(res.msg || '删除失败');
          }
        } catch (error) {
          this.$message.error(error.message || '删除失败');
        }
      }).catch(() => {});
    },
    // 打印消耗单
    handlePrintConsumeOrder() {
      if (!this.currentMainRow) {
        this.$message.warning('请先选择手术单');
        return;
      }
      const token = sessionStorage.getItem(TOKEN_STORE_NAME);
      const surgeryNo = this.currentMainRow.SURGERY_NO;
      const printUrl = `${API_BASE_URL}/PrintPdf/PrintSsDetail?format=pdf&inline=true&SURGERY_NO=${surgeryNo}&Token=${token}`;
      window.open(printUrl, '_blank');
    },
    // 预留：上传消耗单
    handleUploadConsumeOrder() {
      if (!this.currentMainRow) {
        this.$message.warning('请先选择手术单');
        return;
      }
      this.$message.info('TODO：上传消耗单功能待实现');
    },
    // 预留：查看消耗单
    handleViewConsumeOrder() {
      if (!this.currentMainRow) {
        this.$message.warning('请先选择手术单');
        return;
      }
      this.$message.info('TODO：查看消耗单功能待实现');
    },
    // 上传植入物单 - 触发文件选择
    handleUploadImplantOrder() {
      if (!this.currentMainRow) {
        this.$message.warning('请先选择手术单');
        return;
      }
      // 创建隐藏的file input来选择文件
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '*/*'; // 接受所有文件类型
      input.multiple = true; // 支持多选
      input.onchange = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) {
          return;
        }
        try {
          const res = await uploadImplantForm({
            ID: this.currentMainRow.ID,
            files: Array.from(files)
          });
          if (res.code === 200) {
            this.$message.success(res.msg || '上传成功');
            this.loadMainTableData();
          } else {
            this.$message.error(res.msg || '上传失败');
          }
        } catch (error) {
          this.$message.error(error.message || '上传失败');
        }
      };
      input.click();
    },
    // 查看植入物单 - 在浏览器中打开文件
    async handleViewImplantOrder() {
      if (!this.currentMainRow) {
        this.$message.warning('请先选择手术单');
        return;
      }
      try {
        const res = await getImplantForm(this.currentMainRow.ID);
        if (res.code === 200) {
          if (res.result) {
            // 文件名可能是多个，用逗号分隔
            const fileNames = res.result.split(',');
            // 在新窗口打开每个文件
            fileNames.forEach(fileName => {
              const fileUrl = `${API_BASE_URL}/Upload/ImplantForm/${fileName.trim()}`;
              window.open(fileUrl, '_blank');
            });
          } else {
            this.$message.info('该手术单暂无植入物单');
          }
        } else {
          this.$message.error(res.msg || '获取失败');
        }
      } catch (error) {
        this.$message.error(error.message || '获取失败');
      }
    }
  },
  created() {
    this.loadOptions();
    this.loadMainTableData();
  }
};
</script>

<style scoped>
:deep(.el-dialog__body .el-form-item) {
  margin-bottom: 18px !important;
}

.form-section {
  border-radius: 4px;
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #409EFF;
}
</style>

