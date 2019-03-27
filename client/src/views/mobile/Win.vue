<template>
  <div class="win">
    <!-- <el-table v-if="allTableData.length>0" :data="allTableData" style="width: 100%">
        <el-table-column prop="grade" label="级别" width="40%"></el-table-column>
        <el-table-column prop="name" label="名称" width="60%"></el-table-column>
    </el-table> -->
    <div class="container" v-if="allTableData.length>0">
        <div class="content">
            <div class="grade">级别</div>
            <div class="name">名称</div>
        </div>
        <div class="content" v-for="(item,index) in allTableData" :key="index">
            <div class="grade">{{item.grade}}</div>
            <div class="name">{{item.name}}</div>
        </div>
    </div>
    <div class="losing" v-else>
      <span>^_^ 抱抱，下次继续加油...</span>
    </div>
  </div>
</template>

<script>
import { getWin } from "../../api/index";
export default {
  name: "win",
  data() {
    return {
      allTableData: []
    };
  },
  mounted() {
    getWin({
      activityId: this.user.activityId,
      signInUserId: this.user.id
    })
      .then(res => {
        console.log(res.data);
        // this.tableData = res.data;
        this.allTableData = res.data;
        this.filterTableData = res.data;
      })
      .catch(err => {
        this.$message({
          message: "登录失败,请重新登录",
          type: "error"
        });
      });
  },
  computed: {
    user() {
      return this.$store.getters.signInUser;
    }
  },
  methods: {}
};
</script>

<style scoped>
.win {
  width: 100%;
  height: 100%;
  padding: 1.5rem /* 30/20 */;
  box-sizing: border-box;
  background: #fff;
  font-size: .8rem /* 16/20 */;
  color: #555;
}
.win .container{
    width: 100%;
    display: flex;
    flex-direction: column;
}
.win .container .content{
    display: flex;
    height: 1.5rem /* 30/20 */;
    line-height: 1.5rem /* 30/20 */;
    border-bottom: .05rem /* 1/20 */ solid #00be06;
}
.win .container .content .grade{
    width: 30%;
    text-align: center;
    border-right: .05rem /* 1/20 */ solid #00be06;
}
.win .container .content .name{
    width: 70%;
    text-align: center;
}
.win .losing {
  width: 100%;
  height: 5rem /* 100/20 */;
  font-size: 1rem /* 20/20 */;
  color: #555;
  font-weight: 500;
  text-align: center;
  padding: 5rem /* 100/20 */ 0 0 0;
}
</style>
