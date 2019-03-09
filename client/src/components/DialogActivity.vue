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
          <el-form-item prop="name" label="名称:">
            <el-input type="text" v-model="form.name" placeholder="请输入活动名称"></el-input>
          </el-form-item>

          <el-form-item label="活动人数:">
            <el-select v-model="form.num" placeholder="活动人数">
              <el-option
                v-for="(formtype, index) in format_num_list"
                :key="index"
                :label="formtype"
                :value="formtype"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="contact" label="联系人">
            <el-input type="text" v-model="form.contact" placeholder="请输入活动联系人"></el-input>
          </el-form-item>

          <el-form-item prop="phone" label="联系电话">
            <el-input type="text" v-model="form.phone" placeholder="请输入联系人电话"></el-input>
          </el-form-item>

          <el-form-item prop="startTime" label="开始时间">
            <el-date-picker v-model="form.startTime" type="date" placeholder="请选择活动开始时间"></el-date-picker>
          </el-form-item>

          <el-form-item prop="validity" label="持续时间">
            <el-input type="number" v-model="form.validity" placeholder="请输入活动持续时间，单位（天）"></el-input>
          </el-form-item>

          <el-form-item prop="account" label="关联用户名" v-if="!dialog.isCurrentUser">
            <el-autocomplete
              v-model="form.account"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入关联用户名"
              @select="handleSelect"
            ></el-autocomplete>
          </el-form-item>

          <el-form-item prop="remark" label="备注:">
            <el-input type="textarea" v-model="form.remark" placeholder="请输入备注"></el-input>
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
import { mapGetters } from "vuex";
import {
  addOrEditActivities,
  getUsers as _getUsers,
  editUserInfoById
} from "../api/index";
export default {
  name: "logfound",
  props: {
    dialog: Object,
    form: Object
  },
  data() {
    var validateAccount = (rule, value, callback) => {
      var result = this.restaurants.find((item, index, arr)=>{
        return item.value === value;
      })
      if(result == undefined){
        return callback(new Error('用户名不存在'));
      } else {
        callback();
      }
    };
    return {
      format_num_list: ["0-18", "19-88", "89-199", "200及以上"],
      form_rules: {
        name: [{ required: true, message: "名称不能为空！", trigger: "blur" }],
        account: [
          { validator: validateAccount, trigger: 'change' }
        ]
      },
      restaurants: []
    };
  },
  methods: {
    getUser() {
      // 获取表格数据
      _getUsers()
        .then(res => {
          let restaurants = res.data.map((item,index,arr)=>{
            return {
              value:item.name,
              id:item.id
            }
          });
          this.restaurants = restaurants;
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
    onSubmit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          //表单数据验证完成之后，提交数据;
          const url =
            this.dialog.option == "add" ? "add" : `edit/${this.form.id}`;
          addOrEditActivities(url, this.form).then(res => {
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
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants;
      cb(results);
    },
    createStateFilter(queryString) {
      return state => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelect(item) {
      console.log(item);
    }
  },
  mounted() {
    this.getUser();
  }
};
</script>

