<template>
  <div class="logOrder">
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
    >
      <div class="form">
        <el-form ref="form" :model="form" label-width="120px" style="margin:10px;width:auto;">
          <el-form-item prop="No" label="订单编号:">
            <el-input type="text" v-model="form.No"></el-input>
          </el-form-item>
          <el-form-item prop="tUserId" label="用户id:">
            <el-input type="text" v-model="form.tUserId"></el-input>
          </el-form-item>
          <el-form-item prop="goodsIds" label="商品详情:">
            <el-input type="text" v-model="form.goodsIds"></el-input>
          </el-form-item>
          <el-form-item prop="totalPrice" label="总价:">
            <el-input type="text" v-model="form.totalPrice"></el-input>
          </el-form-item>
          <el-form-item class="text_right">
            <el-button @click="dialog.show = false">取 消</el-button>
            <el-button type="primary" @click="onSubmit('form')">提 交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addOrEditOrders } from "../api/index";
export default {
  name: "logOrder",
  props: {
    dialog: Object,
    form: Object
  },
  data() {
    return {};
  },
  methods: {
    onSubmit(form) {
      const url = this.dialog.option == "add" ? "add" : `edit/${this.form.id}`;
      addOrEditOrders(url, this.form)
        .then(res => {
          // 操作成功
          this.$message({
            message: "保存成功！",
            type: "success"
          });
          this.dialog.show = false;
          this.$emit("update");
        })
        .catch(err => {
          this.$message({
            message: err.response.data,
            type: "error"
          });
        });
    }
  }
};
</script>

