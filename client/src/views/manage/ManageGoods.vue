<template>
  <div class="fillcontain">
    <div>
      <div class="title">商品管理</div>
      <el-form :inline="true" ref="search_data" :model="search_data">
        <el-form-item label="筛选:">
          <el-input
            v-model="search_data.searchName"
            placeholder="输入名称查找"
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
        <el-table-column prop="type" label="类别" align="center" width="100"></el-table-column>
        <el-table-column prop="name" label="名称" align="center" width="100"></el-table-column>
        <el-table-column type="icon" label="图片" align="center" width="100">
          <template slot-scope="scope">
            <img :src="iconFilter(scope.row.t_goods_icons)">
          </template>
        </el-table-column>
        <el-table-column prop="inventory" label="库存" align="center" width="100" sortable>
          <template slot-scope="scope">
            <span style="color:#00d053">{{ scope.row.inventory }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sales" label="待发货" align="center" width="100" sortable>
          <template slot-scope="scope">
            <span style="color:#f56767">{{ scope.row.selling }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sales" label="已销量" align="center" width="100" sortable>
          <template slot-scope="scope">
            <span style="color:#f56767">{{ scope.row.sales }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="unitPrice" label="单价" align="center" width="120" sortable>
          <template slot-scope="scope">
            <span style="color:#4db3ff">{{ scope.row.unitPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="上架时间" align="center" width="250" sortable>
          <template slot-scope="scope">
            <el-icon name="time"></el-icon>
            <span style="margin-left: 10px">{{ scope.row.createdAt }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序码" align="center" width="150"></el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="80" sortable>
          <template slot-scope="scope">
            <span
              :style="{color:(scope.row.status == 0 ? '#f00': '#606266')}"
            >{{ scope.row.status == 0 ? "已下架": "正在销售"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" align="center" label="操作" fixed="right" width="210">
          <template slot-scope="scope">
            <el-button
              type="danger"
              icon="delete"
              size="small"
              @click="onEditGoodsStatus(scope.row.id,+!scope.row.status)"
            >{{scope.row.status==0?'上架':'下架'}}</el-button>
            <el-button type="warning" icon="edit" size="small" @click="onEditGoods(scope.row)">编辑</el-button>
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
    <DialogGoods :dialog="dialog" :form="form" @update="getGoods"></DialogGoods>
  </div>
</template>

<script>
import DialogGoods from "../../components/DialogGoods";
import { getGoods as _getGoods, editGoods } from "../../api/index";

export default {
  name: "fundlist",
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
        type: "",
        name: "",
        icon: "",
        inventory: "",
        sales: "",
        unitPrice: "",
        sort: "",
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
        searchName: ""
      }
    };
  },
  components: {
    DialogGoods
  },
  created() {
    this.getGoods();
  },
  methods: {
    getGoods() {
      // 获取表格数据
      _getGoods()
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
        title: "修改商品信息",
        option: "edit"
      };
      var icon = [];
      row.t_goods_icons.forEach(i => {
        icon.push({
          uid: i.uid,
          name: i.name,
          url: this.baseUrl + i.url,
          status: i.status
        });
      });
      this.form = {
        id: row.id,
        type: row.type,
        name: row.name,
        icon: icon,
        inventory: row.inventory,
        sales: row.sales,
        unitPrice: row.unitPrice,
        sort: row.sort,
        remark: row.remark
      };
    },
    onEditGoodsStatus(id, status) {
      editGoods(id, { status })
        .then(res => {
          // 操作成功
          this.$message({
            message: "操作成功！",
            type: "success"
          });
          this.getOrders();
        })
        .catch(err => {
          throw err;
        });
    },
    onDeleteMoney(row, index) {
      // 删除
      deleteGoods(row.id)
        .then(res => {
          this.$message("删除成功");
          this.getGoods();
        })
        .catch(err => {
          console.dir(err);
        });
    },
    onAddMoney() {
      // 添加
      this.dialog = {
        show: true,
        title: "添加商品信息",
        option: "add"
      };
      this.form = {
        id: "",
        type: "",
        name: "",
        icon: [],
        inventory: "",
        sales: "",
        unitPrice: "",
        sort: "",
        remark: ""
      };
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
      this.allTableData = this.filterTableData.filter(item => {
        return item.name.includes(searchName);
      });
      // 分页数据
      this.setPaginations();
    }
  },
  computed: {
    iconFilter() {
      var me = this;
      return function(iconArr) {
        return me.baseUrl + (iconArr.length > 0 ? iconArr[0].url : "");
      };
    },
    //已销售
    sales() {
      var me = this;
      return function(orders) {
        return me.baseUrl + (iconArr.length > 0 ? iconArr[0].url : "");
      };
    },
    //待发货
    selling() {
      var me = this;
      return function(orders) {
        return me.baseUrl + (iconArr.length > 0 ? iconArr[0].url : "");
      };
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