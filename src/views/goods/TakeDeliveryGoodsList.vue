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
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="add">新增拿货商品</el-button>
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
        <el-table-column fixed="left" prop="goodsId" width="80" label="商品ID"></el-table-column>
        <el-table-column prop="businessTitle" show-overflow-tooltip  label="商品名称"></el-table-column>
        <el-table-column prop="goodsPrice"  label="商品价格"></el-table-column>
        <el-table-column prop="mainPic" label="商品主图" >
          <template slot-scope="scope">
            <img style="width:80px" @click="prev(scope.$index)" :src="baseUrl + scope.row.mainPic" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="typeName" label="商品分类"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span class="true" v-if="scope.row.status===1">启用</span>
            <span class="false" v-if="scope.row.status===2">禁用</span>
            <span class="false" v-if="scope.row.status===3">删除</span>
          </template>
        </el-table-column>
        <el-table-column prop="details" label="商品图文详情">
          <template slot-scope="scope">
            <el-button size="mini" @click="opengoodsDetail(scope.row)" type="primary">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="创建时间" ></el-table-column>
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
    <v-dialog :width="500" :zIndex="10" :dialogShow="dialogFormVisible" :title="isedit?'编辑拿货商品':'新增拿货商品'">
      <i slot="close" class="el-icon-close close" @click="dialogFormVisible=false"></i>
      <div slot="con">
        <el-form ref="form" @submit.native.prevent :model="form" label-width="100px">
          <el-form-item label="商品名称" prop="businessTitle">
            <span style="position:absolute;left:-75px;color:#eb453c;">*</span>
            <el-input style="width: 300px" v-model="form.businessTitle" clearable placeholder="请输入商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="type">
            <span style="position:absolute;left:-75px;color:#eb453c;">*</span>
            <el-select style="width: 300px" v-model="form.typeId" clearable placeholder="请选择商品分类">
              <el-option v-for="(item, index) in goodsTypeConfigList" :key="index" :label="item.typeName" :value="item.goodsTypeConfigId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品价格" prop="goodsPrice">
            <span style="position:absolute;left:-75px;color:#eb453c;">*</span>
            <el-input style="width: 300px" type="number" v-model="form.goodsPrice" clearable placeholder="请输入商品价格"></el-input>
          </el-form-item>
          <el-form-item label="商品主图" prop="advertPic">
            <span style="position:absolute;left:-75px;color:#eb453c;">*</span>
            <my-upload :option="option" @updelete="updelete" @upfiles="upfiles"/>
          </el-form-item>
          <el-form-item label="商品图文详情" prop="details">
            <span style="position:absolute;left:-105px;color:#eb453c;">*</span>
            <el-button size="mini" type="primary" @click="dialogFormVisible1=true">编辑</el-button>
            <el-button size="mini" type="primary" @click="opengoodsDetail(form)" v-show="form.details">查看</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer-btn" slot="footer-btn">
        <el-button @click="dialogFormVisible=false">取消</el-button>
        <el-button type="primary" :disabled="cansubmit" :loading="subLoad" @click="submit">{{submitTitle}}</el-button>
      </div>
    </v-dialog>
    <v-dialog :width="900" :zIndex="10" :dialogShow="dialogFormVisible1" title="编辑商品图文详情">
      <i slot="close" class="el-icon-close close" @click="dialogFormVisible1=false"></i>
      <div slot="con">
        <Tinymce v-model="form.details" :edit="dialogFormVisible1" />
      </div>
      <div class="footer-btn" slot="footer-btn">
        <el-button @click="dialogFormVisible1=false">取消</el-button>
        <el-button type="primary" @click="dialogFormVisible1=false">确定</el-button>
      </div>
    </v-dialog>
    <v-dialog :width="500" :zIndex="10" :dialogShow="dialogFormVisible2" title="商品图文详情预览">
      <i slot="close" class="el-icon-close close" @click="dialogFormVisible2=false"></i>
      <div slot="con">
        <div class="html" v-html="html"></div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import Tinymce from '@c/Tinymce'
import vDialog from '@c/dialog'
import cbLoading from '@c/loading'
import { baseUrl } from '@/utils/commom'
import { takeDeliveryGoodsList, addTakeDeliveryGoods, updateTakeDeliveryGoodsStatus, goodsTypeConfigList } from '@/api'
import MyUpload from '@/components/Upload'
export default {
  data () {
    return {
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      isedit: false,
      form: { businessTitle: '', mainPic: '', typeId: '', details: '', goodsPrice: '' },
      requestData: { pageNum: 1, pageSize: 20, businessTitle: '', typeId: '' },
      list: [],
      total: 0,
      subLoad: false,
      baseUrl: baseUrl,
      option: {
        type: 1,
        file: [],
        count: 1
      },
      choseA: [],
      html: '',
      submitTitle: '确定',
      goodsTypeConfigList: []
    }
  },
  components: {
    vDialog,
    cbLoading,
    MyUpload,
    Tinymce
  },
  computed: {
    cansubmit: function () {
      return (this.form.businessTitle === '' || this.form.mainPic === '' || this.form.typeId === '' || this.form.details === '' || this.form.goodsPrice === '' || this.subLoad)
    }
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
    handleSelectionChange (val) {
      this.choseA = val
    },
    search () {
      this.requestData.pageNum = 1
      this.getList()
    },
    refresh () {
      this.requestData.businessTitle = ''
      this.getList()
    },
    async getList () {
      const res = await takeDeliveryGoodsList({ pageNum: 1, pageSize: 20, businessTitle: this.requestData.businessTitle, typeId: this.requestData.typeId === 'all' ? '' : this.requestData.typeId })
      if (res.result === '0') {
        this.list = res.datas.list
        this.total = res.datas.totalRow
      }
    },
    add () {
      this.dialogFormVisible = true
      this.isedit = false
      this.setReset()
    },
    upfiles (file) {
      this.form.mainPic = file.files[0]
    },
    updelete (file) {
      this.form.mainPic = ''
    },
    setReset () {
      this.option.file = []
      this.form = { businessTitle: '', mainPic: '', typeId: '', details: '', goodsPrice: '' }
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
        res = await addTakeDeliveryGoods({ businessId: this.form.businessId, gradeType: this.form.gradeType, reputationType: this.form.reputationType })
      } else {
        res = await addTakeDeliveryGoods(this.form)
      }
      if (res.result === '1') {
        this.dialogFormVisible = false
        this.getList()
      }
      this.subLoad = false
      this.submitTitle = '确定'
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
      const res = await updateTakeDeliveryGoodsStatus({ status: status, goodsIds: ids.toString() })
      if (res.result === '1') {
        this.getList()
      }
    },
    prev (index) {
      const srcs = this.list.map(item => {
        return this.baseUrl + item.mainPic
      })
      this.$store.commit('prevData', { show: true, data: { index: index, srcs: srcs } })
    },
    opengoodsDetail (row) {
      this.dialogFormVisible2 = true
      this.html = row.details
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
  }
}
</style>

<style>
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
