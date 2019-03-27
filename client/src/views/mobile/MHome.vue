<template>
  <div class="mHome">
    <div class="logo">
      <img src="../../assets/bg.jpg" alt="my login image">
    </div>
    <div class="name">
      {{user.name}}
    </div>
    <div class="info">
      签到成功
    </div>
    <div class="time">
      {{user.createdAt}}
    </div>
    <div class="menus">
      <div class="menu" v-for="(item,index) in menus" :key="index" @click="$router.push({ name: 'win', params: { userId: '123' }})">
        <img class="title" :src="item.url" alt="my login image">
        <div class="name">
          {{item.name}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
export default {
  name: "mHome",
  data() {
    return {
      menus:[
        {
          name:'签到',
          url:'./images/1.jpg'
        },{
          name:'上墙',
          url:'./images/2.jpg'
        },{
          name:'摇一摇',
          url:'./images/3.jpg'
        },{
          name:'投票',
          url:'./images/4.jpg'
        },{
          name:'数钱',
          url:'./images/5.jpg'
        },{
          name:'中奖信息',
          url:'./images/6.jpg',
          path:'/'
        },
      ]
    };
  },
  computed: {
    user(){
      return this.$store.getters.signInUser;
    }
  },
  methods: {
    isEmpty(value) {
      return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
      );
    }
  }
};
</script>

<style scoped>
.mHome {
  width: 100%;
  height: 100%;
  padding: 4rem /* 80/20 */ 1.5rem /* 30/20 */ 0 1.5rem /* 30/20 */;
  box-sizing: border-box;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mHome .name{
  font-size: 1.2rem /* 24/20 */;
  font-weight: 600;
  height: 3rem /* 60/20 */;
  line-height: 3rem /* 60/20 */;
}

.mHome .info{
  height: 3rem /* 60/20 */;
  width: 100%;
  background-image:url(../../assets/bg0.png);
  background-repeat:no-repeat;
  background-size:100% 100%;
  -moz-background-size:100% 100%;
  display: flex;
  justify-content: center;
  line-height: 3rem /* 60/20 */;
  font-size: 1.5rem /* 30/20 */;
  font-weight: 600;
  font-family: 'Courier New', Courier, monospace;
  color: #fff;
}

.mHome .time{
  height: 3rem /* 60/20 */;
  line-height: 3rem /* 60/20 */;
  font-size: .8rem /* 16/20 */;
}

.logo {
  text-align: center;
}
.logo img {
  width: 5rem /* 100/20 */;
  border-radius: 0.5rem /* 10/20 */;
}
.menus{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.menus .menu{
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items:center;
}
.menus .menu .title{
  width: 4rem /* 80/20 */;
  height: 4rem /* 80/20 */;
  border-radius: 0.5rem /* 10/20 */;
}
.menus .menu .name{
  width: 5rem /* 100/20 */;
  height: 2rem /* 40/20 */;
  font-size: .9rem /* 18/20 */;
  display: flex;
  justify-content: center;
  line-height: 2rem /* 40/20 */;
  font-weight: 500;
}
</style>
