<template>
  <div class="content">
    <div class="search-zu">
      <div class="search-item">
        <span class="title">商品名称：</span>
        <el-input v-model="requestData.businessTitle" clearable @keyup.enter.native="search" placeholder="请输入商品名称"></el-input>
      </div>
      <el-button size="mini" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <div class="btn-con">
        <el-button-group class="operation-button">
          <el-button size="mini" icon="el-icon-delete" type="danger" @click="freeze(3)">删除</el-button>
          <el-button size="mini" icon="el-icon-close" type="danger" @click="freeze(1)">禁用</el-button>
          <el-button size="mini" icon="el-icon-check" type="primary" @click="freeze(2)">启用</el-button>
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="add">新增返佣商品</el-button>
          <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
        </el-button-group>
      </div>
    </div>
    <el-tabs v-model="requestData.typeId">
      <el-tab-pane label="全部" name="all"></el-tab-pane>
      <el-tab-pane v-for="(item, index) in goodsTypeConfigList" :key="index" :label="item.typeName" :name="String(item.goodsTypeConfigId)"></el-tab-pane>
    </el-tabs>
    <div class="my-table">
      <el-table :data="list" ref="table" style="width: 100%" height="100%" :stripe="true" highlight-current-row size="mini" @selection-change="handleSelectionChange">
        <el-table-column fixed type="selection" width="55"></el-table-column>
        <el-table-column fixed="left" prop="goodsId" width="60" label="商品ID"></el-table-column>
        <el-table-column prop="businessTitle" show-overflow-tooltip min-width="200"  label="商品名称"></el-table-column>
        <el-table-column prop="mainPic" label="商品主图" width="90" >
          <template slot-scope="scope">
            <img style="width:80px" @click="prev(scope.$index)" :src="scope.row.mainPic" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="typeName" width="100" label="商品分类"></el-table-column>
        <el-table-column prop="couponAfterPrice" width="100" label="券后价格"></el-table-column>
        <el-table-column prop="couponPrice" width="150" label="优惠券金额"></el-table-column>
        <el-table-column prop="commissionPrice" width="80" label="佣金"></el-table-column>
        <el-table-column prop="proportion" width="80" label="佣金比例"></el-table-column>
        <el-table-column prop="surplusNum" width="100" label="样品剩余数量"></el-table-column>
        <el-table-column prop="conditionNum" width="100" label="取样条件数量"></el-table-column>
        <el-table-column prop="itemUrl" width="250" label="宝贝链接">
          <template slot-scope="scope">
            <span class="outurl" @click="out(scope.row.itemUrl)">{{scope.row.itemUrl}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="promotionLink" width="250" label="推广链接">
          <template slot-scope="scope">
            <span class="outurl" @click="out(scope.row.promotionLink)">{{scope.row.promotionLink}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="couponShareUrl" width="250" label="宝贝+券二合一推广链接">
          <template slot-scope="scope">
            <span class="outurl" @click="out(scope.row.couponShareUrl)">{{scope.row.couponShareUrl}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="activityStartDate" width="100" label="活动开始时间"></el-table-column>
        <el-table-column prop="activityEndDate" width="100" label="活动结束时间"></el-table-column>
        <el-table-column prop="status" width="70" label="状态">
          <template slot-scope="scope">
            <span class="true" v-if="scope.row.status===1">启用</span>
            <span class="false" v-if="scope.row.status===2">禁用</span>
            <span class="false" v-if="scope.row.status===3">删除</span>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" width="150" label="创建时间"></el-table-column>
        <el-table-column fixed="right" prop="shotRequirement" width="80"  label="拍摄要求">
          <template slot-scope="scope">
            <el-button size="mini" @click="opengoodsDetail1(scope.row.shotRequirement, 1)" type="primary">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column fixed="right" prop="ruleDescription" width="80"  label="规则说明">
          <template slot-scope="scope">
            <el-button size="mini" @click="opengoodsDetail1(scope.row.ruleDescription, 2)" type="primary">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column fixed="right" prop="details" width="80"  label="商品详情">
          <template slot-scope="scope">
            <el-button size="mini" @click="opengoodsDetail(scope.row)" type="primary">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column fixed="right" prop="createDate" width="80" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="edit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <cb-loading :show="$store.getters.loading"/>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="requestData.pageNum"
        :page-sizes="[20, 25, 30, 35]"
        :page-size="requestData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <v-dialog :width="500" :zIndex="10" :dialogShow="dialogFormVisible" :title="isedit?'编辑返佣商品':'新增返佣商品'">
      <i slot="close" class="el-icon-close close" @click="dialogFormVisible=false"></i>
      <div slot="con">
        <el-form ref="form" @submit.native.prevent :model="form" label-width="100px">
          <el-form-item label="选择商品" prop="businessTitle">
            <span style="position:absolute;left:-75px;color:#eb453c;">*</span>
            <span v-show="form.businessTitle" style="padding-right:10px ">{{form.businessTitle}}</span>
            <el-button v-if="!isedit" size="mini" type="primary" @click="dialogFormVisible1=true">选择商品</el-button>
            <!-- <el-input style="width: 300px" v-model="form.businessTitle" clearable placeholder="请输入商品名称"></el-input> -->
          </el-form-item>
          <el-form-item label="商品主图" prop="advertPic">
            <span style="position:absolute;left:-75px;color:#eb453c;">*</span>
            <div class="img"><img style="width:90px" :src="form.mainPic" alt=""></div>
          </el-form-item>
          <el-form-item label="商品分类" prop="type">
            <span style="position:absolute;left:-75px;color:#eb453c;">*</span>
            <el-select style="width: 300px" v-model="form.typeId" clearable placeholder="请选择商品分类">
              <el-option v-for="(item, index) in goodsTypeConfigList" :key="index" :label="item.typeName" :value="item.goodsTypeConfigId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="券后价价格" prop="couponAfterPrice">
            <span style="position:absolute;left:-88px;color:#eb453c;">*</span>
            <el-input disabled style="width: 300px" type="number" v-model="form.couponAfterPrice" clearable placeholder="请输入券后价价格"></el-input>
          </el-form-item>
          <el-form-item label="优惠券金额" prop="couponPrice">
            <span style="position:absolute;left:-88px;color:#eb453c;">*</span>
            <el-input disabled style="width: 300px" type="number" v-model="form.couponPrice" clearable placeholder="请输入优惠券金额"></el-input>
          </el-form-item>
          <!-- <el-form-item label="押金金额" prop="depositPric">
            <span style="position:absolute;left:-75px;color:#eb453c;">*</span>
            <el-input style="width: 300px" type="number" v-model="form.depositPric" clearable placeholder="请输入押金金额"></el-input>
          </el-form-item> -->
          <el-form-item label="佣金" prop="commissionPrice">
            <span style="position:absolute;left:-46px;color:#eb453c;">*</span>
            <el-input disabled style="width: 300px" type="number" v-model="form.commissionPrice" clearable placeholder="请输入佣金"></el-input>
          </el-form-item>
          <el-form-item label="佣金比例" prop="proportion">
            <span style="position:absolute;left:-75px;color:#eb453c;">*</span>
            <el-input disabled style="width: 300px" type="number" v-model="form.proportion" clearable placeholder="请输入佣金比例"></el-input>
          </el-form-item>
          <el-form-item label="样品剩余数量" prop="surplusNum">
            <span style="position:absolute;left:-103px;color:#eb453c;">*</span>
            <el-input style="width: 300px" type="number" v-model="form.surplusNum" clearable placeholder="请输入样品剩余数量"></el-input>
          </el-form-item>
          <el-form-item label="取样条件数量" prop="conditionNum">
            <span style="position:absolute;left:-103px;color:#eb453c;">*</span>
            <el-input style="width: 300px" type="number" v-model="form.conditionNum" clearable placeholder="请输入取样条件数量"></el-input>
          </el-form-item>
          <el-form-item label="活动开始时间" prop="activityStartDate">
            <span style="position:absolute;left:-105px;color:#eb453c;">*</span>
            <el-date-picker disabled style="width: 300px" v-model="form.activityStartDate" type="date" clearable placeholder="请选择活动开始时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="活动结束时间" prop="activityEndDate">
            <span style="position:absolute;left:-105px;color:#eb453c;">*</span>
            <el-date-picker disabled style="width: 300px" v-model="form.activityEndDate" type="date" clearable placeholder="请选择活动结束时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="拍摄要求" prop="shotRequirement">
            <span style="position:absolute;left:-75px;color:#eb453c;">*</span>
            <el-input type="textarea" rows="5" style="width: 300px" v-model="form.shotRequirement" clearable placeholder="请输入拍摄要求"></el-input>
          </el-form-item>
          <el-form-item label="规则说明" prop="ruleDescription">
            <span style="position:absolute;left:-75px;color:#eb453c;">*</span>
            <el-input type="textarea" rows="5" style="width: 300px" v-model="form.ruleDescription" clearable placeholder="请输入规则说明"></el-input>
          </el-form-item>
          <el-form-item label="商品图文详情" prop="details">
            <span style="position:absolute;left:-105px;color:#eb453c;">*</span>
            <el-button size="mini" type="primary" @click="dialogFormVisible2=true">编辑</el-button>
            <el-button size="mini" type="primary" @click="opengoodsDetail(form)" v-show="form.details">查看</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer-btn" slot="footer-btn">
        <el-button @click="dialogFormVisible=false">取消</el-button>
        <el-button type="primary" :disabled="cansubmit" :loading="subLoad" @click="submit">确定</el-button>
      </div>
    </v-dialog>
    <v-dialog class="getgoods" :width="900" :zIndex="10" :dialogShow="dialogFormVisible1" title="商品选择">
      <i slot="close" class="el-icon-close close" @click="dialogFormVisible1=false"></i>
      <div slot="con">
        <div class="search-zu">
          <div class="search-item">
            <span class="title">商品名称：</span>
            <el-input v-model="requestData1.businessTitle" clearable @keyup.enter.native="search1" placeholder="请输入商品名称"></el-input>
          </div>
          <div class="search-item">
            <span class="title">商品所在地：</span>
            <el-input v-model="requestData1.itemloc" clearable @keyup.enter.native="search1" placeholder="请输入商品名称"></el-input>
          </div>
          <el-button size="mini" type="primary" icon="el-icon-search" @click="search1">搜索</el-button>
          <span style="padding: 0 10px;line-height: 40px;color: #eb453c;font-size:12px">双击商品列表行即可选中该商品</span>
        </div>
        <div class="my-table">
          <el-table :data="goodslist" ref="table" style="width: 100%" height="500" :stripe="true" highlight-current-row size="mini" @row-dblclick="dblclick">
            <el-table-column prop="businessTitle" show-overflow-tooltip min-width="200"  label="商品名称"></el-table-column>
            <el-table-column prop="mainPic" label="商品主图" width="90" >
              <template slot-scope="scope">
                <img style="width:80px" @click="prev(scope.$index, 1)" :src="scope.row.mainPic" alt="">
              </template>
            </el-table-column>
            <el-table-column prop="shopTitle" label="店铺名称"></el-table-column>
            <el-table-column prop="couponAfterPrice" label="券后价格"></el-table-column>
            <el-table-column prop="couponPrice" label="优惠券金额"></el-table-column>
            <el-table-column prop="commissionPrice" label="佣金"></el-table-column>
            <el-table-column prop="proportion"  label="佣金比例">
              <template slot-scope="scope">
                <span style="padding-right:5px">{{scope.row.proportion}}</span>%
              </template>
            </el-table-column>
          </el-table>
          <cb-loading :show="$store.getters.loading"/>
        </div>
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :current-page="requestData1.pageNum"
            :page-sizes="[20, 25, 30, 35]"
            :page-size="requestData1.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total1">
          </el-pagination>
        </div>
      </div>
    </v-dialog>
    <v-dialog :width="900" :zIndex="10" :dialogShow="dialogFormVisible2" title="编辑商品图文详情">
      <i slot="close" class="el-icon-close close" @click="dialogFormVisible2=false"></i>
      <div slot="con">
        <Tinymce v-model="form.details" :edit="dialogFormVisible2" />
      </div>
      <div class="footer-btn" slot="footer-btn">
        <el-button @click="dialogFormVisible2=false">取消</el-button>
        <el-button type="primary" @click="dialogFormVisible2=false">确定</el-button>
      </div>
    </v-dialog>
    <v-dialog :width="500" :zIndex="10" :dialogShow="dialogFormVisible3" title="商品图文详情预览">
      <i slot="close" class="el-icon-close close" @click="dialogFormVisible3=false"></i>
      <div slot="con">
        <div style="min-height: 300px" class="html" v-html="html"></div>
      </div>
    </v-dialog>
    <v-dialog :width="500" :zIndex="10" :dialogShow="dialogFormVisible4" :title="title">
      <i slot="close" class="el-icon-close close" @click="dialogFormVisible4=false"></i>
      <div slot="con">
        <div style="min-height: 300px; line-height: 25px" class="html" v-html="html1"></div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import vDialog from '@c/dialog'
import Tinymce from '@c/Tinymce'
import cbLoading from '@c/loading'
import { commissionGoodsList, queryCommissionGoodsList, addCommissionGoods, updateCommissionGoods, updateCommissionGoodsStatus, goodsTypeConfigList } from '@/api'
export default {
  data () {
    return {
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      dialogFormVisible4: false,
      title: '',
      isedit: false,
      requestData: { pageNum: 1, pageSize: 20, businessTitle: '', typeId: '' },
      requestData1: { pageNum: 1, pageSize: 20, businessTitle: '', itemloc: '' },
      form: { businessTitle: '', mainPic: '', typeId: '', details: '', couponAfterPrice: '', couponPrice: '', commissionPrice: '', proportion: '', surplusNum: '', shotRequirement: '', ruleDescription: '', conditionNum: '', depositPric: 0, activityStartDate: '', activityEndDate: '', promotionLink: '', itemId: '', itemUrl: '', couponShareUrl: '' },
      list: [],
      total: 0,
      subLoad: false,
      goodslist: [],
      total1: 0,
      html: '',
      html1: '',
      timeFn: null,
      submitTitle: '确定',
      choseA: [],
      goodsTypeConfigList: []
    }
  },
  computed: {
    cansubmit: function () {
      return (this.form.businessTitle === '' || this.form.typeId === '' || this.form.details === '' || this.form.surplusNum === '' || this.form.shotRequirement === '' || this.form.ruleDescription === '' || this.form.conditionNum === '' || this.subLoad)
    }
  },
  components: {
    vDialog,
    cbLoading,
    Tinymce
  },
  methods: {
    handleSizeChange (val) {
      this.requestData.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.requestData.pageNum = val
      this.getList()
    },
    search () {
      this.requestData.pageNum = 1
      this.getList()
    },
    handleSelectionChange (val) {
      this.choseA = val
    },
    handleSizeChange1 (val) {
      this.requestData1.pageSize = val
      this.getQueryList()
    },
    handleCurrentChange1 (val) {
      this.requestData1.pageNum = val
      this.getQueryList()
    },
    search1 () {
      this.requestData1.pageNum = 1
      this.getQueryList()
    },
    refresh () {
      this.requestData = { pageNum: 1, pageSize: 20, businessTitle: '', typeId: 'all' }
      this.getList()
    },
    async getList () {
      const res = await commissionGoodsList({ pageNum: 1, pageSize: 20, businessTitle: this.requestData.businessTitle, typeId: this.requestData.typeId === 'all' ? '' : this.requestData.typeId })
      if (res.result === '0') {
        this.list = res.datas.list
        this.total = res.datas.totalRow
      }
    },
    freeze (row) {
      if (this.choseA.length === 0) {
        this.$message({ type: 'warning', message: '请先选择要操作的商品' })
        return
      }
      const ids = this.choseA.map(item => {
        return item.goodsId
      })
      let tip
      row === 2 ? tip = '此操作将启用选中的商品，是否继续？' : row === 3 ? tip = '此操作将删除选中的商品，是否继续？' : tip = '此操作将禁用选中的商品，是否继续？'
      this.$confirm(tip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._freeze(row === 2 ? 1 : row === 1 ? 2 : 3, ids)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消'
        })
      })
    },
    async _freeze (status, ids) {
      const res = await updateCommissionGoodsStatus({ status: status, goodsIds: ids.toString() })
      if (res.result === '1') {
        this.getList()
      }
    },
    add () {
      this.dialogFormVisible = true
      this.isedit = false
      this.setReset()
    },
    edit (row) {
      this.dialogFormVisible = true
      this.isedit = true
      this.form.goodsId = row.goodsId
      this.form.businessTitle = row.businessTitle
      this.form.mainPic = row.mainPic
      this.form.typeId = row.typeId
      this.form.details = row.details
      this.form.couponAfterPrice = row.couponAfterPrice
      this.form.couponPrice = row.couponPrice
      this.form.commissionPrice = row.commissionPrice
      this.form.proportion = row.proportion
      this.form.surplusNum = row.surplusNum
      this.form.shotRequirement = row.shotRequirement
      this.form.ruleDescription = row.ruleDescription
      this.form.conditionNum = row.conditionNum
      this.form.depositPric = row.depositPrice
      this.form.activityStartDate = row.activityStartDate
      this.form.activityEndDate = row.activityEndDate
      this.form.promotionLink = row.promotionLink
      this.form.itemId = row.itemId
      this.form.itemUrl = row.itemUrl
      this.form.couponShareUrl = row.couponShareUrl
    },
    editDetail () {
      this.dialogFormVisibl2 = true
    },
    setReset () {
      this.form = { businessTitle: '', mainPic: '', typeId: '', details: '', couponAfterPrice: '', couponPrice: '', commissionPrice: '', proportion: '', surplusNum: '', shotRequirement: '', ruleDescription: '', conditionNum: '', depositPric: 0, activityStartDate: '', activityEndDate: '', promotionLink: '', itemId: '', itemUrl: '', couponShareUrl: '' }
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
      if (this.isedit) {
        res = await updateCommissionGoods(this.form)
      } else {
        res = await addCommissionGoods(this.form)
      }
      if (res.result === '1') {
        this.dialogFormVisible = false
        this.getList()
      }
      this.subLoad = false
      this.submitTitle = '确定'
    },
    out (url) {
      window.open(url, '_blank')
    },
    prev (index, type) {
      let srcs
      if (type) {
        srcs = this.goodslist.map(item => {
          return item.mainPic
        })
      } else {
        srcs = this.list.map(item => {
          return item.mainPic
        })
      }
      this.$store.commit('prevData', { show: true, data: { index: index, srcs: srcs } })
    },
    async getQueryList () {
      const res = await queryCommissionGoodsList(this.requestData1)
      if (res.result === '0') {
        this.goodslist = res.datas.list
        this.total1 = res.datas.totalRow
      }
    },
    dblclick (row) {
      this.dialogFormVisible1 = false
      this.form.businessTitle = row.businessTitle
      this.form.mainPic = row.mainPic
      this.form.couponAfterPrice = row.couponAfterPrice
      this.form.commissionPrice = row.commissionPrice
      this.form.couponPrice = row.couponPrice
      this.form.proportion = row.proportion
      this.form.activityStartDate = row.activityStartDate
      this.form.activityEndDate = row.activityEndDate
      this.form.promotionLink = row.promotionLink
      this.form.itemId = row.itemId
      this.form.itemUrl = row.itemUrl
      this.form.couponShareUrl = row.couponShareUrl
    },
    opengoodsDetail (row) {
      this.dialogFormVisible3 = true
      this.html = row.details
    },
    opengoodsDetail1 (row, type) {
      row = row.replace(/\n/g, '<br>')
      this.title = type === 1 ? '拍摄要求' : '规则说明'
      this.dialogFormVisible4 = true
      this.html1 = row
    },
    async _goodsTypeConfigList () {
      const res = await goodsTypeConfigList({})
      if (res.result === '0') {
        this.goodsTypeConfigList = res.datas.list
      }
    }
  },
  created () {
    this.requestData.typeId = 'all'
    this.getList()
    this._goodsTypeConfigList()
    // this.getQueryList()
  },
  watch: {
    'requestData.typeId': function (val) {
      this.requestData.pageNum = 1
      this.getList()
    }
  }
}
</script>

<style scoped lang="less">
.content{
  height: 100%;
  .btn-con {
    float: right;
  }
  .my-table {
    position: relative;
    height: calc(100% - 142px);
    .outurl {
      cursor: pointer;
      &:hover {
        color: #eb453c;
      }
    }
  }
}
</style>
<style>
  .getgoods .dialog_content .dialog_body {
    max-height: 608px!important;
  }
  .html img{
    width: 100%;
    display: block;
    margin: 5px auto;
  }
  .html {
    padding-bottom: 5px;
    font-size: 12px;
  }
</style>
