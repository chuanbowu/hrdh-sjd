<template>
  <div class="info">
    <div class="headimg">
      <div class="img">
        <img class="img1" v-if="userInfo.headPic" :src="baseUrl+userInfo.headPic" alt="">
        <img class="img2" v-else :src="require('@/assets/img/upload.svg')" alt="">
      </div>
      <div class="name">
        <p><i class="el-icon-phone" style="padding-right:5px"></i>电话：{{userInfo.phone}}</p>
        <p><i class="el-icon-user-solid" style="padding-right:5px"></i>昵称：{{userInfo.nickName?userInfo.nickName:'暂未设置'}} <i class="el-icon-s-help" style="padding: 0 5px"></i>邀请码：{{userInfo.code?userInfo.code:'暂未设置'}}</p>
      </div>
      <div class="btn"><el-button v-if="userInfo.type===1" size="mini" type="primary" @click="dialogFormVisible=true">完善资料</el-button><el-button v-if="userInfo.type===2" size="mini" type="primary" @click="edit">编辑资料</el-button></div>
    </div>
    <div class="item">
      <div>店铺名称：{{userInfo.shopName?userInfo.shopName:'暂未设置'}}</div>
      <div>淘宝或天猫店铺地址：{{userInfo.shopAddress?userInfo.shopAddress:'暂未设置'}}</div>
    </div>
    <div class="item">
      <div>收样人姓名：{{userInfo.consigneeName?userInfo.consigneeName:'暂未设置'}}</div>
      <div>收样的地址：{{userInfo.consigneeAddress?userInfo.consigneeAddress:'暂未设置'}}</div>
    </div>
    <div class="item">
      <div>宝贝描述：{{userInfo.babyDescription?userInfo.babyDescription:'暂未设置'}}</div>
      <div>卖家服务：{{userInfo.sellerServices?userInfo.sellerServices:'暂未设置'}}</div>
      <div>物流服务：{{userInfo.logisticsService?userInfo.logisticsService:'暂未设置'}}</div>
      <div></div>
    </div>
    <div class="item">
      <div>
        商家等级：
        <span class="true" v-if="userInfo.gradeType===1">初级</span>
        <span class="true" v-if="userInfo.gradeType===2">中级</span>
        <span class="true" v-if="userInfo.gradeType===3">高级</span>
      </div>
      <div>
        淘宝信誉等级：
        <template v-if="userInfo.reputationType<6"><img v-for="(item, index) in userInfo.reputationType" :key="index" class="icon" :src="require('@/assets/img/level4.gif')" alt=""></template>
        <template v-if="userInfo.reputationType>5&&userInfo.reputationType<11"><img v-for="(item, index) in userInfo.reputationType-5" :key="index" class="icon" :src="require('@/assets/img/level5.gif')" alt=""></template>
        <template v-if="userInfo.reputationType>10&&userInfo.reputationType<16"><img v-for="(item, index) in userInfo.reputationType-10" :key="index" class="icon" :src="require('@/assets/img/level1.gif')" alt=""></template>
        <template v-if="userInfo.reputationType>15"><img v-for="(item, index) in userInfo.reputationType-15" :key="index" class="icon" :src="require('@/assets/img/level2.png')" alt=""></template>
      </div>
      <div>客服电话：{{userInfo.customerPhone?userInfo.customerPhone:'暂未设置'}}</div>
      <div>客服微信二维码：<img style="width: 80px" :src="baseUrl+userInfo.customerWeChatPic" alt=""></div>
    </div>
    <v-dialog :width="500" :zIndex="10" :dialogShow="dialogFormVisible" :title="userInfo.type===1?'完善个人资料':'修改个人资料'">
      <i slot="close" class="el-icon-close close" @click="dialogFormVisible=false"></i>
      <div slot="con">
        <el-form ref="form" @submit.native.prevent :model="form" label-width="140px">
          <el-form-item v-if="userInfo.type===1" label="昵称" prop="nickName">
            <span style="position:absolute;left:-47px;color:#eb453c;">*</span>
            <el-input style="width: 300px" v-model="form.nickName" clearable placeholder="请输入昵称"></el-input>
          </el-form-item>
          <el-form-item v-if="userInfo.type===1" label="头像" prop="advertPic">
            <span style="position:absolute;left:-47px;color:#eb453c;">*</span>
            <my-upload :option="option" @updelete="updelete" @upfiles="upfiles"/>
          </el-form-item>
          <el-form-item v-if="userInfo.type===1" label="店铺名称" prop="shopName">
            <span style="position:absolute;left:-77px;color:#eb453c;">*</span>
            <el-input style="width: 300px" v-model="form.shopName" clearable placeholder="请输入店铺名称"></el-input>
          </el-form-item>
          <el-form-item v-if="userInfo.type===1" label="淘宝或天猫店铺地址" prop="shopAddress">
            <span style="position:absolute;left:-144px;color:#eb453c;">*</span>
            <el-input style="width: 300px" v-model="form.shopAddress" clearable placeholder="请输入淘宝或天猫店铺地址"></el-input>
          </el-form-item>
          <el-form-item v-if="userInfo.type===1" label="邀请码" prop="code">
            <span style="position:absolute;left:-60px;color:#eb453c;">*</span>
            <el-input style="width: 300px" type="number" v-model="form.code" clearable placeholder="请输入邀请码"></el-input>
          </el-form-item>
          <el-form-item label="收样人姓名" prop="consigneeName">
            <span style="position:absolute;left:-90px;color:#eb453c;">*</span>
            <el-input style="width: 300px" v-model="form.consigneeName" clearable placeholder="请输入收样人姓名"></el-input>
          </el-form-item>
          <el-form-item label="收样的地址" prop="consigneeAddress">
            <span style="position:absolute;left:-88px;color:#eb453c;">*</span>
            <el-input style="width: 300px" v-model="form.consigneeAddress" clearable placeholder="请输入收样的地址"></el-input>
          </el-form-item>
          <el-form-item v-if="userInfo.type===1" label="宝贝描述" prop="babyDescription">
            <span style="position:absolute;left:-77px;color:#eb453c;">*</span>
            <el-input style="width: 300px" type="number" v-model="form.babyDescription" clearable placeholder="请输入宝贝描述评分"></el-input>
          </el-form-item>
          <el-form-item v-if="userInfo.type===1" label="卖家服务" prop="sellerServices">
            <span style="position:absolute;left:-77px;color:#eb453c;">*</span>
            <el-input style="width: 300px" type="number" v-model="form.sellerServices" clearable placeholder="请输入卖家服务评分"></el-input>
          </el-form-item>
          <el-form-item v-if="userInfo.type===1" label="物流服务" prop="logisticsService">
            <span style="position:absolute;left:-77px;color:#eb453c;">*</span>
            <el-input type="number" style="width: 300px" v-model="form.logisticsService" clearable placeholder="请输入物流服务评分"></el-input>
          </el-form-item>
          <el-form-item label="客服电话" prop="customerPhone">
            <span style="position:absolute;left:-77px;color:#eb453c;">*</span>
            <el-input type="number" style="width: 300px" v-model="form.customerPhone" clearable placeholder="请输入客服电话"></el-input>
          </el-form-item>
          <el-form-item label="客服微信二维码" prop="advertPic">
            <span style="position:absolute;left:-117px;color:#eb453c;">*</span>
            <my-upload :option="option1" @updelete="updelete1" @upfiles="upfiles1"/>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer-btn" slot="footer-btn">
        <el-button @click="dialogFormVisible=false">取消</el-button>
        <el-button type="primary" :disabled="cansubmit" :loading="subLoad" @click="submit">确定</el-button>
      </div>
    </v-dialog>
  </div>
</template>
<script>
import { businessInfo, businessPerfect, updateBusiness } from '@/api'
import { baseUrl } from '@/utils/commom'
import MyUpload from '@/components/Upload'
import vDialog from '@c/dialog'
export default {
  data () {
    return {
      baseUrl: baseUrl,
      option: {
        type: 1,
        file: [],
        count: 1
      },
      option1: {
        type: 1,
        file: [],
        count: 1
      },
      form: { nickName: '', headPic: '', shopName: '', shopAddress: '', code: '', consigneeName: '', consigneeAddress: '', babyDescription: '', sellerServices: '', logisticsService: '', customerPhone: '', customerWeChatPic: '' },
      userInfo: {},
      dialogFormVisible: false,
      submitTitle: '确定',
      subLoad: false
    }
  },
  components: {
    MyUpload,
    vDialog
  },
  computed: {
    cansubmit: function () {
      if (this.userInfo.type === 1) {
        return (this.form.nickName === '' || this.form.headPic === '' || this.form.shopName === '' || this.form.shopAddress === '' || this.form.code === '' || this.form.consigneeName === '' || this.form.consigneeAddress === '' || this.form.babyDescription === '' || this.form.sellerServices === '' || this.form.logisticsService === '' || this.form.customerPhone === '' || this.form.customerWeChatPic === '' || this.subLoad)
      } else {
        return (this.form.consigneeName === '' || this.form.consigneeAddress === '' || this.form.customerPhone === '' || this.form.customerWeChatPic === '' || this.subLoad)
      }
    }
  },
  methods: {
    async getuserInfo () {
      const res = await businessInfo({})
      if (res.result === '0') {
        sessionStorage.setItem('userInfo', JSON.stringify(res.datas))
        this.userInfo = res.datas
        if (this.userInfo.type === 1) {
          this.$alert('您的个人资料还未完善，请完善个人资料', '提示', {
            confirmButtonText: '确定',
            showClose: false,
            callback: action => {
              this.dialogFormVisible = true
            }
          })
        }
      }
    },
    upfiles (file) {
      this.form.headPic = file.files[0]
    },
    updelete (file) {
      this.form.headPic = ''
    },
    upfiles1 (file) {
      this.form.customerWeChatPic = file.files[0]
    },
    updelete1 (file) {
      this.form.customerWeChatPic = ''
    },
    submit () {
      if (this.cansubmit) return
      this.subLoad = true
      this.submitTitle = '提交中...'
      setTimeout(() => {
        this.create()
      }, 700)
    },
    async create () {
      let res
      if (this.userInfo.type === 1) {
        res = await businessPerfect(this.form)
      } else {
        res = await updateBusiness({ consigneeName: this.form.consigneeName, consigneeAddress: this.form.consigneeAddress, customerPhone: this.form.customerPhone, customerWeChatPic: this.form.customerWeChatPic })
      }
      if (res.result === '1') {
        this.dialogFormVisible = false
        this.getuserInfo()
      }
      this.subLoad = false
      this.submitTitle = '确定'
    },
    edit () {
      this.dialogFormVisible = true
      this.option1.file = []
      this.form.consigneeName = this.userInfo.consigneeName
      this.form.consigneeAddress = this.userInfo.consigneeAddress
      this.form.customerPhone = this.userInfo.customerPhone
      this.option1.file.push(this.userInfo.customerWeChatPic)
      this.form.customerWeChatPic = this.userInfo.customerWeChatPic
    }
  },
  created () {
    this.getuserInfo()
  }
}
</script>
<style scoped lang="less">
  .headimg {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 10px solid #e2e9ef;
    position: relative;
    .img {
      border: 2px solid #DF56E1;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      position: relative;
      cursor: pointer;
      margin-right: 15px;
      .img1 {
        position: absolute;
        width: 100%;
        min-height: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .img2 {
        position: absolute;
        width: 100%;
        min-height: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .name {
      font-size: 13px;
      p:nth-child(1) {
        margin-bottom: 10px;
      }
    }
  }
  .btn {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .item {
    display: flex;
    align-items: center;
    padding: 40px 0;
    border-bottom: 10px solid #e2e9ef;
    div {
      flex: 1;
      display: flex;
      align-items: center;
    }
  }
  .upload {
    display: none;
  }
</style>
