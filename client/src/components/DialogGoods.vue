<template>
  <div class="logFund">
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
    >
      <div class="form">
        <el-form
          ref="form"
          :model="form"
          :rules="form_rules"
          label-width="120px"
          style="margin:10px;width:auto;"
        >
          <el-form-item label="类别:">
            <el-select v-model="form.type" placeholder="类别">
              <el-option
                v-for="(formtype, index) in format_type_list"
                :key="index"
                :label="formtype"
                :value="formtype"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="name" label="名称:">
            <el-input type="name" v-model="form.name"></el-input>
          </el-form-item>

          <el-form-item prop="icon" label="图片:">
            <el-upload
              class="upload-photos"
              name="photos"
              ref="upload"
              :action="fileApi"
              :auto-upload="false"
              :on-success="handleSuccess"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="form.icon"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>

          <el-form-item prop="inventory" label="库存:">
            <el-input type="inventory" v-model="form.inventory"></el-input>
          </el-form-item>

          <el-form-item prop="unitPrice" label="单价:">
            <el-input type="unitPrice" v-model="form.unitPrice"></el-input>
          </el-form-item>

          <el-form-item prop="sort" label="排序码:">
            <el-input type="sort" v-model="form.sort"></el-input>
          </el-form-item>

          <el-form-item prop="remark" label="备注:">
            <el-input type="textarea" v-model="form.remark"></el-input>
          </el-form-item>

          <el-form-item class="text_right">
            <el-button @click="dialog.show = false">取 消</el-button>
            <el-button type="primary" @click="submitUpload('form')">提 交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addOrEditGoods } from "../api/index";
export default {
  name: "logfound",
  props: {
    dialog: Object,
    form: Object
  },
  data() {
    return {
      format_type_list: [
        "推荐",
        "提现手续费",
        "充值",
        "优惠券",
        "充值礼券",
        "转账"
      ],
      form_rules: {
        name: [{ required: true, message: "名称不能为空！", trigger: "blur" }],
        inventory: [
          { required: true, message: "库存不能为空！", trigger: "blur" }
        ],
        unitPrice: [
          { required: true, message: "单价不能为空！", trigger: "blur" }
        ]
      },
      fileApi: `/api/goods/upload/`
    };
  },
  methods: {
    submitUpload() {
      let uploadFiles = this.$refs["upload"].uploadFiles;
      let status = uploadFiles.every(item => {
        return item.status == "success";
      });
      if (status) {
        this.form.icon = uploadFiles.map(item => {
          return {
            name: item.name,
            url: item.response || item.url.replace(this.baseUrl, ""),
            status: item.status,
            uid: item.uid
          };
        });
        this.onSubmit("form");
        return;
      }
      this.$refs["upload"].submit();
    },
    onSubmit(form) {
      /* var _form = Object.assign({}, this.form);
      _form.icon = JSON.stringify(_form.icon); */
      this.$refs[form].validate(valid => {
        if (valid) {
          //表单数据验证完成之后，提交数据;
          const url =
            this.dialog.option == "add" ? "add" : `edit/${this.form.id}`;
          addOrEditGoods(url, this.form).then(res => {
            // 操作成功
            this.$message({
              message: "保存成功！",
              type: "success"
            });
            this.dialog.show = false;
            this.$emit("update");
          });
        }
      });
    },
    handleSuccess(res, file, fileList) {
      if (res.status == 404) {
        // 操作成功
        this.$message({
          message: "文件上传失败,请重新上传！",
          type: "error"
        });
        return;
      }
      let status = fileList.every(item => {
        return item.status == "success";
      });
      if (status) {
        this.form.icon = fileList.map(item => {
          return {
            name: item.name,
            url: item.response || item.url.replace(this.baseUrl, ""),
            status: item.status,
            uid: item.uid
          };
        });
        this.onSubmit("form");
      }
    },
    handleRemove(file, fileList) {},
    handlePreview(file) {}
  }
};
</script>

