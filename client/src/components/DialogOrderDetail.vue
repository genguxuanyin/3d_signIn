<template>
  <div class="logOrderDetails">
    <el-dialog
      :title="dialog.title"
      width="30%"
      :visible.sync="dialog.show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
    >
      <div class="form">
        <el-table v-if="form.length > 0" :data="form" max-height="450">
          <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
          <el-table-column type="index" label="图片" align="center" width="100">
            <template slot-scope="scope">
              <img :src="imgUrl(scope.row.t_good.t_goods_icons)">
            </template>
          </el-table-column>
          <el-table-column prop="unitPrice" label="单价" align="center" width="100">
            <template slot-scope="scope">
              <span>{{scope.row.t_good.unitPrice}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="数量" align="center" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.amount}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" label="总价" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ (scope.row.amount * scope.row.t_good.unitPrice).toFixed(2) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "logOrderDetails",
  props: {
    dialog: Object,
    form: Array
  },
  computed: {
    imgUrl() {
      return function(icons) {
        if (icons.length == 0) {
          return "";
        }
        debugger;
        return icons[0].url.startsWith("//www.gravatar.com")
          ? icons[0].url
          : this.baseUrl + icons[0].url;
      };
    }
  }
};
</script>
<style scoped>
img {
  height: 60px;
  width: 60px;
  border-radius: 50%;
}
</style>

