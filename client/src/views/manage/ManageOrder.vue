<template>
  <div class="fillcontain">
    <div>
      <div class="title">订单管理</div>
      <el-form :inline="true" ref="search_data" :model="search_data">
        <el-form-item label="创建时间:">
          <el-date-picker
            v-model="search_data.startTime"
            type="datetime"
            placeholder="选择开始时间"
            @change="onScreeoutOrders()"
          ></el-date-picker>--
          <el-date-picker
            v-model="search_data.endTime"
            type="datetime"
            placeholder="选择结束时间"
            @change="onScreeoutOrders()"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="search_data.searchName"
            placeholder="输入收件人查找"
            clearable
            @input="onScreeoutOrders()"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="search_data.searchPhone"
            placeholder="输入联系方式查找"
            clearable
            @input="onScreeoutOrders()"
          ></el-input>
        </el-form-item>
        <el-form-item class="btnRight">
          <el-button type="primary" size="small" icon="view" @click="onAddOrders()">添加</el-button>
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
        <el-table-column prop="No" label="编号" align="center" width="160"></el-table-column>
        <el-table-column prop="t_user.name" label="收件人" align="center" width="80"></el-table-column>
        <el-table-column type="t_user.phone" label="联系方式" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.t_user.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="t_user.address" label="收货地址" align="center" width="400">
          <template slot-scope="scope">
            <span style="color:#ff4400">{{ scope.row.t_user.address }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="商品种类" align="center" width="80">
          <template slot-scope="scope">
            <span style="color:#f56767">{{ scope.row.t_orders_goods_refs.length }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="商品数量" align="center" width="80">
          <template slot-scope="scope">
            <span style="color:#f56767">{{goodsAmount(scope.row.t_orders_goods_refs)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sales" label="合计价格" align="center" width="100">
          <template slot-scope="scope">
            <span style="color:#00d053">{{totalPrice(scope.row.t_orders_goods_refs)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sales" label="实付金额" align="center" width="100">
          <template slot-scope="scope">
            <span style="color:#00d053">{{ scope.row.totalPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" align="center" width="190" sortable>
          <template slot-scope="scope">
            <el-icon name="time"></el-icon>
            <span style="margin-left: 10px">{{ scope.row.createdAt }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="80" sortable>
          <template slot-scope="scope">
            <span
              :style="{color:(scope.row.status == 0 ? '#f00': '#606266')}"
            >{{ scope.row.status == 0 ? "待发货": "已发货"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" align="center" label="操作" fixed="right" width="220">
          <template slot-scope="scope">
            <el-button type="warning" icon="edit" size="small" @click="showDetails(scope.row)">详情</el-button>
            <el-button
              type="danger"
              icon="delete"
              size="small"
              @click="onEditOrders(scope.row.id,+!scope.row.status)"
            >{{scope.row.status==0?'发货':'撤回'}}</el-button>
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
    <DialogOrder :dialog="dialog" :form="form" @update="getOrders"></DialogOrder>
    <!-- 弹框详情页面 -->
    <DialogOrderDetail :dialog="dialog_detail" :form="form_detail"></DialogOrderDetail>
  </div>
</template>

<script>
import DialogOrder from "../../components/DialogOrder";
import DialogOrderDetail from "../../components/DialogOrderDetail";
import { getOrders as _getOrders, editOrders, deleteOrders } from "../../api/index";

export default {
  name: "fundlist",
  data() {
    return {
      tableData: [],
      allTableData: [],
      filterTableData: [],
      dialog_detail: {
        show: false,
        title: ""
      },
      dialog: {
        show: false,
        title: ""
      },
      form: {
        id: "",
        No: "",
        tUserId: "",
        goodsIds: [],
        amount: "",
        totalPrice: ""
      },
      form_detail: [],
      //需要给分页组件传的信息
      paginations: {
        page_index: 1, // 当前位于哪页
        total: 0, // 总数
        page_size: 5, // 1页显示多少条
        page_sizes: [5, 10, 15, 20], //每页显示多少条
        layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
      },
      search_data: {
        startTime: "",
        endTime: "",
        searchName: "",
        searchPhone: ""
      }
    };
  },
  components: {
    DialogOrder,
    DialogOrderDetail
  },
  created() {
    this.getOrders();
  },
  methods: {
    getOrders() {
      // 获取表格数据
      _getOrders()
        .then(res => {
          // this.tableData = res.data;
          this.allTableData = res.data;
          this.filterTableData = res.data;
          // 设置分页数据
          this.setPaginations();
          this.$store.dispatch("setOrders", res.data);
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
    showDetails(row) {
      this.dialog_detail = {
        show: true,
        title: "订单详细信息"
      };
      this.form_detail = row.t_orders_goods_refs;
    },
    onDeleteOrders(row, index) {
      // 删除
      deleteOrders(row.id)
        .then(res => {
          this.$message("删除成功");
          this.getOrders();
        })
        .catch(err => {
          console.dir(err);
        });
    },
    onAddOrders() {
      // 添加
      this.dialog = {
        show: true,
        title: "添加订单信息",
        option: "add"
      };
      this.form = {
        id: "",
        No: "",
        tUserId: "",
        goodsIds: "",
        amount: "",
        totalPrice: ""
      };
    },
    onEditOrders(id, status) {
      if (status == 0) {
        this.$confirm("此操作将撤销发货, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          editOrders(id, { status })
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
        });
        return false;
      }
      editOrders(id, { status })
        .then(res => {
          // 操作成功
          this.$message({
            message: "操作成功！",
            type: "success"
          });
          this.getOrders();
        })
        .catch(err => {
          this.$message({
            message: err.response.data,
            type: "error"
          });
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
    onScreeoutOrders() {
      // 筛选
      const stime =
        this.search_data.startTime != ""
          ? this.search_data.startTime.getTime()
          : new Date("2019-01-01 00:00:00").getTime();
      const etime =
        this.search_data.endTime != ""
          ? this.search_data.endTime.getTime()
          : new Date().getTime();
      const searchName = this.search_data.searchName;
      const searchPhone = this.search_data.searchPhone;
      this.allTableData = this.filterTableData.filter(item => {
        let date = new Date(item.updatedAt);
        let time = date.getTime();
        return (
          time >= stime &&
          time <= etime &&
          item.t_user.name.includes(searchName) &&
          item.t_user.phone.includes(searchPhone)
        );
      });
      // 分页数据
      this.setPaginations();
    }
  },
  computed: {
    iconFilter() {
      let me = this;
      return function(icon) {
        let iconArr = JSON.parse(icon);
        return me.baseUrl + (iconArr.length > 0 ? iconArr[0].url : "");
      };
    },
    goodsAmount() {
      return function(goods) {
        let goodsAmount = 0;
        goods.forEach((g, i, arr) => {
          goodsAmount += g.amount;
        });
        return goodsAmount;
      };
    },
    totalPrice() {
      return function(goods) {
        let totalPrice = 0;
        goods.forEach((g, i, arr) => {
          totalPrice += g.amount * g.t_good.unitPrice;
        });
        return totalPrice.toFixed(2);
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