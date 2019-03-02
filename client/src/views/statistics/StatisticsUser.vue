<template>
  <div class="fillcontain">
    <div>
      <div class="title">用户分析</div>
      <el-select v-model="time" placeholder="请选择统计时间">
        <el-option
          v-for="(_time, index) in time_list"
          :key="index"
          :label="_time.label"
          :value="_time.value"
        ></el-option>
      </el-select>
    </div>
    <div class="table_container">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item title="基础统计" name="1">
          <div>注册用户:{{registerUser.length}}</div>
          <div style="display: block; width: 500px">
            <canvas id="myChart"></canvas>
          </div>
        </el-collapse-item>
        <el-collapse-item title name="2">
          <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
          <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
        </el-collapse-item>
        <el-collapse-item title="最近一月核心指标" name="3">
          <div>简化流程：设计简洁直观的操作流程；</div>
          <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
          <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
        </el-collapse-item>
        <el-collapse-item title="全部核心指标" name="4">
          <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
          <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getUsers as _getUsers } from "../../api/index";
import Chart from "chart.js";
export default {
  name: "statisticsUser",
  data() {
    return {
      activeNames: ["1"],
      time: 0,
      time_list: [
        {
          label: "昨天",
          value: -1
        },
        {
          label: "一周",
          value: -7
        },
        {
          label: "一月",
          value: -30
        },
        {
          label: "全部",
          value: 0
        }
      ]
    };
  },
  created() {
    if (this.users.length == 0) {
      this.getUsers();
    }
  },
  mounted(){
    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            borderColor: [
              "rgba(255,99,132,1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)"
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  },
  computed: {
    ...mapGetters(["users"]),
    registerUser() {
      const stime =
        this.time != "" && this.time != 0
          ? this.getDate(this.time).getTime()
          : new Date("2019-01-01 00:00:00").getTime();
      return this.users.filter(user => {
        let date = new Date(user.createdAt);
        let time = date.getTime();
        return time >= stime;
      });
    }
  },
  methods: {
    getUsers() {
      _getUsers()
        .then(res => {
          this.$store.dispatch("setUsers", res.data);
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
    handleChange(val) {
      console.log(val);
    },
    getDate(day) {
      return new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * day);
    }
  }
};
</script>
<style scoped>
.fillcontain {
  padding: 20px 40px;
}
.title {
  padding-bottom: 20px;
}
</style>