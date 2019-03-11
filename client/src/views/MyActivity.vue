<template>
  <div class="fillcontain">
    <div>
      <div class="title">活动管理</div>
      <el-form :inline="true" ref="search_data" :model="search_data">
        <el-form-item label="筛选:">
          <el-input
            v-model="search_data.searchName"
            placeholder="输入活动名称查找"
            clearable
            @input="onScreeoutGoods()"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="search_data.searchUserName"
            placeholder="输入关联用户名查找"
            clearable
            @input="onScreeoutGoods()"
          ></el-input>
        </el-form-item>
        <el-form-item class="btnRight">
          <el-button type="primary" size="small" icon="view" @click="onAddMoney()">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table
        v-if="tableData.length > 0"
        :data="tableData"
        max-height="450"
        border
        :default-sort="{prop: 'date', order: 'descending'}"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
        <el-table-column prop="name" label="活动名称" align="center" width="200"></el-table-column>
        <el-table-column prop="num" label="活动人数" align="center" width="100"></el-table-column>
        <el-table-column prop="contact" label="联系人" align="center" width="100">
          <template slot-scope="scope">
            <span style="color:#00d053">{{ scope.row.contact }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系电话" align="center" width="120">
          <template slot-scope="scope">
            <span style="color:#f56767">{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" align="center" width="160" sortable>
          <template slot-scope="scope">
            <el-icon name="time"></el-icon>
            <span style="margin-left: 10px">{{ scope.row.startTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="validity" label="持续时间" align="center" width="100">
          <template slot-scope="scope">
            <span style="color:#4db3ff">{{ scope.row.validity }}天</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="account" label="关联用户名" align="center" width="100">
          <template slot-scope="scope">
            <span style="color:#00d053">{{ scope.row.account }}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="remark" label="备注" align="center" width="150"></el-table-column>
        <el-table-column prop="createdAt" label="创建时间" align="center" width="220" sortable>
          <template slot-scope="scope">
            <el-icon name="time"></el-icon>
            <span style="margin-left: 10px">{{ scope.row.createdAt }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="80" sortable>
          <template slot-scope="scope">
            <span
              :style="{color:(getStatus(scope.row.startTime,scope.row.validity,scope.row.status).color)}"
            >{{ getStatus(scope.row.startTime,scope.row.validity,scope.row.status).value }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" align="center" label="操作" fixed="right" width="260">
          <template slot-scope="scope">
            <el-button
              :type="scope.row.status==0?'warning':'primary'"
              v-if="scope.row.status == -1||scope.row.status==0"
              icon="delete"
              size="small"
              @click="onEditGoodsStatus(scope.row.id,scope.row.status == -1?0:-1)"
            >{{scope.row.status==-1?'提交审核':'撤回'}}</el-button>
            <el-button 
              type="warning"
              v-if="scope.row.status == -1"
              icon="edit" 
              size="small" 
              @click="onEditGoods(scope.row)"
            >编辑</el-button>
            <el-button 
              type="success"
              v-if="getStatus(scope.row.startTime,scope.row.validity,scope.row.status).status =='1_1'"
              size="small" 
              @click="toActivity(scope.row.id)"
            >进入</el-button>
            <el-button
              type="danger"
              icon="delete"
              size="small"
              @click="onDeleteMoney(scope.row,scope.$index)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row>
        <el-col :span="24">
          <div class="pagination">
            <el-pagination
              v-if="paginations.total > 0"
              :page-sizes="paginations.page_sizes"
              :page-size="paginations.page_size"
              :layout="paginations.layout"
              :total="paginations.total"
              :current-page.sync="paginations.page_index"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            ></el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 弹框页面 -->
    <DialogActivity :dialog="dialog" :form="form" @update="getActivities"></DialogActivity>
  </div>
</template>

<script>
import DialogActivity from "../components/DialogActivity";
import {
  getActivitiesByAccount as _getActivities,
  editActivities,
  deleteActivities
} from "../api/index";

export default {
  name: "activitylist",
  data() {
    return {
      tableData: [],
      allTableData: [],
      filterTableData: [],
      dialog: {
        show: false,
        title: "",
        option: "edit"
      },
      form: {
        id: "",
        name: "",
        num: "",
        contact: "",
        phone: "",
        startTime: "",
        validity: "",
        account: "",
        remark: ""
      },
      //需要给分页组件传的信息
      paginations: {
        page_index: 1, // 当前位于哪页
        total: 0, // 总数
        page_size: 5, // 1页显示多少条
        page_sizes: [5, 10, 15, 20], //每页显示多少条
        layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
      },
      search_data: {
        searchName: "",
        searchUserName: ""
      }
    };
  },
  components: {
    DialogActivity
  },
  created(){
    this.getActivities();
  },
  methods: {
    getActivities() {
      // 获取表格数据
      _getActivities(this.user.name)
        .then(res => {
          console.log(res.data);
          // this.tableData = res.data;
          this.allTableData = res.data;
          this.filterTableData = res.data;
          // 设置分页数据
          this.setPaginations();
          this.$store.dispatch("setGoods", res.data);
        })
        .catch(err => {
          if (err.response.status == 404) {
            this.$message({
              message: err.response.data,
              type: "error"
            });
          }
        });
    },
    onEditGoods(row) {
      // 编辑
      this.dialog = {
        show: true,
        title: "修改活动信息",
        option: "edit",
        isCurrentUser: true
      };
      this.form = {
        id: row.id,
        name: row.name,
        num: row.num,
        contact: row.contact,
        phone: row.phone,
        startTime: row.startTime,
        validity: row.validity,
        account: row.account,
        remark: row.remark
      };
    },
    onEditGoodsStatus(id, status) {
      editActivities(id, { status })
        .then(res => {
          // 操作成功
          this.$message({
            message: "操作成功！",
            type: "success"
          });
          this.getActivities();
        })
        .catch(err => {
          throw err;
        });
    },
    onDeleteMoney(row, index) {
      // 删除
      this.$confirm("此操作将永久删除该活动, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteActivities(row.id)
          .then(res => {
            this.$message("删除成功");
            this.getActivities();
          })
          .catch(err => {
            console.dir(err);
          });
        })
        .catch(() => {
          
        });
    },
    onAddMoney() {
      // 添加
      debugger
      this.dialog = {
        show: true,
        title: "添加活动信息",
        option: "add",
        isCurrentUser: true
      };
      this.form = {
        name: "",
        num: "",
        contact: "",
        phone: "",
        startTime: "",
        validity: "",
        account: this.user.name,
        remark: ""
      };
    },
    toActivity(id){
      this.$router.push({ path: `/activity/${id}` });
    },
    handleCurrentChange(page) {
      // 当前页
      let sortnum = this.paginations.page_size * (page - 1);
      let table = this.allTableData.filter((item, index) => {
        return index >= sortnum;
      });
      // 设置默认分页数据
      this.tableData = table.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    handleSizeChange(page_size) {
      // 切换size
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      this.tableData = this.allTableData.filter((item, index) => {
        return index < page_size;
      });
    },
    setPaginations() {
      // 总页数
      this.paginations.total = this.allTableData.length;
      this.paginations.page_index = 1;
      this.paginations.page_size = 5;
      // 设置默认分页数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    onScreeoutGoods() {
      // 筛选
      const searchName = this.search_data.searchName;
      const searchUserName = this.search_data.searchUserName;
      this.allTableData = this.filterTableData.filter(item => {
        return (
          item.name.includes(searchName) &&
          item.account.includes(searchUserName)
        );
      });
      // 分页数据
      this.setPaginations();
    }
  },
  computed: {
    //待发货
    getStatus() {
      var me = this;
      return function(startTime, validity, status) {
        startTime = new Date(startTime + " 00:00:00");
        const currentTime = new Date();
        if (status === -1) {
          return {
            status: '-1',
            color: "#606266",
            value: "未提交"
          };
        } else if (status === 0) {
          return {
            status: '0',
            color: "#f00",
            value: "待审核"
          };
        } else if (currentTime.getTime() < startTime.getTime()) {
          return {
            status: '1_0',
            color: "#606266",
            value: "未开始"
          };
        } else if (
          currentTime.getTime() >= startTime.getTime() &&
          currentTime.getTime() <
            startTime.getTime() + validity * 24 * 60 * 60 * 1000
        ) {
          return {
            status: '1_1',
            color: "#409EFF",
            value: "正在进行"
          };
        } else {
          return {
            status: '1_2',
            color: "#909399",
            value: "已结束"
          };
        }
      };
    },
    user() {
      return this.$store.getters.user;
    }
  },
  watch:{
    user() {
        this.getActivities();
    },
  }
};
</script>
<style scoped>
.title {
  padding: 0 0 10px 0;
  margin: 0 0 10px 0;
}
.fillcontain {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight {
  float: right;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
img {
  height: 60px;
  width: 60px;
  border-radius: 50%;
}
</style>