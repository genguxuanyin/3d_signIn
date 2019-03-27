<template>
  <div class="fillcontain">
    <div>
      <div class="title">签到管理</div>
      <el-form :inline="true" ref="search_data" :model="search_data">
        <el-form-item label="筛选:">
          <el-input
            v-model="search_data.searchName"
            placeholder="输入姓名查找"
            clearable
            @input="onScreeoutUser()"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="search_data.searchPhone"
            placeholder="输入手机号查找"
            clearable
            @input="onScreeoutUser()"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search_data.searchActivityId" clearable placeholder="按活动名称选择" @change="onScreeoutUser()">
            <el-option
              v-for="item in activitys"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
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
        <el-table-column prop="aName" label="活动名称" align="center" width="300">
          <template slot-scope="scope">
            <span>{{ scope.row.t_activity.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" align="center" width="150"></el-table-column>
        <el-table-column prop="phone" label="手机号" align="center" width="160"></el-table-column>
        <el-table-column prop="wechatId" label="微信ID" align="center" width="250"></el-table-column>
        <el-table-column prop="createdAt" label="签到时间" align="center" width="220" sortable>
          <template slot-scope="scope">
            <el-icon name="time"></el-icon>
            <span style="margin-left: 10px">{{ scope.row.createdAt }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" align="center" label="操作" fixed="right" width="180">
          <template slot-scope="scope">
            <el-button
              type="danger"
              icon="delete"
              size="small"
              @click="onEdit(scope.row,1)"
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
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getSignInList as _getSignInList, editUserInfoById } from "../../api/index";
export default {
  name: "manageUser",
  data() {
    return {
      tableData: [],
      allTableData: [],
      filterTableData: [],
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
        searchPhone: "",
        searchActivityId:""
      },
      activitys:[]
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  created(){
    this.getSignInList();
  },
  watch:{
    user(){
      this.getSignInList();
    }
  },
  methods: {
    getSignInList() {
      // 获取表格数据
      _getSignInList()
        .then(res => {
          this.allTableData = res.data;
          this.filterTableData = res.data;
          var activitys = res.data.map((item,index,arr) => {
            return {id:item.tActivityId,name:item.t_activity.name};
          });
          this.activitys = this.removeDuplicateItems(activitys);
          // 设置分页数据
          this.setPaginations();
          // this.$store.dispatch("setUsers", res.data);
        })
        .catch(err => {
          console.dir(err);
          if (err.response.status == 404) {
            this.$message({
              message: err.response.data,
              type: "error"
            });
          }
        });
    },
    onEdit(row, option) {
      /* editUserInfoById(row.id, { status: option })
        .then(res => {
          this.$message("操作成功");
          this.getSignInList();
        })
        .catch(err => {
          console.dir(err);
        }); */
    },
    removeDuplicateItems(arr){
      var _arr = arr.map((item)=>{
        return JSON.stringify(item);
      })
      return [...new Set(_arr)].map((item)=>{
        return JSON.parse(item);
      });
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
    onScreeoutUser() {
      // 筛选
      const searchName = this.search_data.searchName;
      const searchPhone = this.search_data.searchPhone;
      const searchActivityId = this.search_data.searchActivityId;
      this.allTableData = this.filterTableData.filter(item => {
        return item.name.includes(searchName)
         && item.phone.includes(searchPhone)
         && (item.tActivityId == searchActivityId || searchActivityId == '');
      });
      // 分页数据
      this.setPaginations();
    }
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