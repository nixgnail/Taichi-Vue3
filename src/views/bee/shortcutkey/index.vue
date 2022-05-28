<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="分类" prop="category">
        <el-input
          v-model="queryParams.category"
          placeholder="请输入分类"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="快捷键" prop="keys">
        <el-input
          v-model="queryParams.keys"
          placeholder="请输入快捷键"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="标签^逗号分隔" prop="tags">
        <el-input
          v-model="queryParams.tags"
          placeholder="请输入标签^逗号分隔"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="应用名称" prop="appName">
        <el-input
          v-model="queryParams.appName"
          placeholder="请输入应用名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="排序" prop="sortNo">
        <el-date-picker clearable
          v-model="queryParams.sortNo"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择排序">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="热度" prop="hotLevel">
        <el-input
          v-model="queryParams.hotLevel"
          placeholder="请输入热度"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="浏览次数" prop="viewCount">
        <el-input
          v-model="queryParams.viewCount"
          placeholder="请输入浏览次数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="适用版本" prop="appVer">
        <el-input
          v-model="queryParams.appVer"
          placeholder="请输入适用版本"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['bee:shortcukey:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['bee:shortcukey:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['bee:shortcukey:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['bee:shortcukey:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="shortcukeyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="分类" align="center" prop="category" />
      <el-table-column label="快捷键" align="center" prop="keys" />
      <el-table-column label="标签^逗号分隔" align="center" prop="tags" />
      <el-table-column label="应用名称" align="center" prop="appName" />
      <el-table-column label="说明" align="center" prop="keyDesc" />
      <el-table-column label="排序" align="center" prop="sortNo" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.sortNo, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="功能类型" align="center" prop="funType" />
      <el-table-column label="热度" align="center" prop="hotLevel" />
      <el-table-column label="浏览次数" align="center" prop="viewCount" />
      <el-table-column label="适用版本" align="center" prop="appVer" />
      <el-table-column label="自定义样式" align="center" prop="keyStyle" />
      <el-table-column label="备注" align="center" prop="note" />
      <el-table-column label="角色状态" align="center" prop="status" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['bee:shortcukey:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['bee:shortcukey:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      :limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改快捷键对话框 -->
    <el-dialog :title="title" v-model="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="分类" prop="category">
          <el-input v-model="form.category" placeholder="请输入分类" />
        </el-form-item>
        <el-form-item label="快捷键" prop="keys">
          <el-input v-model="form.keys" placeholder="请输入快捷键" />
        </el-form-item>
        <el-form-item label="标签^逗号分隔" prop="tags">
          <el-input v-model="form.tags" placeholder="请输入标签^逗号分隔" />
        </el-form-item>
        <el-form-item label="应用名称" prop="appName">
          <el-input v-model="form.appName" placeholder="请输入应用名称" />
        </el-form-item>
        <el-form-item label="说明" prop="keyDesc">
          <el-input v-model="form.keyDesc" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="排序" prop="sortNo">
          <el-date-picker clearable
            v-model="form.sortNo"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择排序">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="热度" prop="hotLevel">
          <el-input v-model="form.hotLevel" placeholder="请输入热度" />
        </el-form-item>
        <el-form-item label="浏览次数" prop="viewCount">
          <el-input v-model="form.viewCount" placeholder="请输入浏览次数" />
        </el-form-item>
        <el-form-item label="适用版本" prop="appVer">
          <el-input v-model="form.appVer" placeholder="请输入适用版本" />
        </el-form-item>
        <el-form-item label="自定义样式" prop="keyStyle">
          <el-input v-model="form.keyStyle" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input v-model="form.note" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="删除标志" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script >
import { listShortcukey, getShortcukey, delShortcukey, addShortcukey, updateShortcukey } from "@/api/bee/shortcukey";

export default {
  name: "Shortcukey",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 快捷键表格数据
      shortcukeyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        category: null,
        keys: null,
        tags: null,
        appName: null,
        keyDesc: null,
        sortNo: null,
        funType: null,
        hotLevel: null,
        viewCount: null,
        appVer: null,
        keyStyle: null,
        note: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询快捷键列表 */
    getList() {
      this.loading = true;
      listShortcukey(this.queryParams).then(response => {
        this.shortcukeyList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        category: null,
        keys: null,
        tags: null,
        appName: null,
        keyDesc: null,
        sortNo: null,
        funType: null,
        hotLevel: null,
        viewCount: null,
        appVer: null,
        keyStyle: null,
        note: null,
        status: "0",
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加快捷键";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getShortcukey(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改快捷键";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateShortcukey(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addShortcukey(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除快捷键编号为"' + ids + '"的数据项？').then(function() {
        return delShortcukey(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('bee/shortcukey/export', {
        ...this.queryParams
      }, `shortcukey_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>