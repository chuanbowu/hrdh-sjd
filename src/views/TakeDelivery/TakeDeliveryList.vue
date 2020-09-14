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
          <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
        </el-button-group>
      </div>
    </div>
    <el-tabs v-model="type">
      <el-tab-pane label="领样等待审核" name="1"></el-tab-pane>
      <el-tab-pane label="领样审核失败" name="2"></el-tab-pane>
      <el-tab-pane label="领样待发样" name="3"></el-tab-pane>
      <el-tab-pane label="领样已发样" name="4"></el-tab-pane>
      <el-tab-pane label="红人已收样" name="5"></el-tab-pane>
      <el-tab-pane label="红人寄回样中" name="6"></el-tab-pane>
      <el-tab-pane label="领样已收样" name="7"></el-tab-pane>
    </el-tabs>
    <div class="my-table" v-show="type==='1'">
      <el-table :data="list" ref="table" style="width: 100%" height="100%" :stripe="true" highlight-current-row size="mini">
        <el-table-column fixed="left" prop="orderId" width="60" label="取样ID"></el-table-column>
        <el-table-column prop="phone" width="100"  label="红人手机号码"></el-table-column>
        <el-table-column prop="nickName" width="100" label="红人昵称"></el-table-column>
        <el-table-column prop="headPic" label="红人头像" width="90" >
          <template slot-scope="scope">
            <img style="width:80px" @click="prev(scope.$index,1)" :src="baseUrl + scope.row.headPic" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="status" width="100"  label="取样状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status">{{typeA[scope.row.status-1].name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="businessTitle" min-width="200" show-overflow-tooltip label="商品标题"></el-table-column>
        <el-table-column prop="mainPic" label="商品主图" width="90" >
          <template slot-scope="scope">
            <img style="width:80px" @click="prev(scope.$index,2)" :src="scope.row.mainPic" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="couponAfterPrice" width="100"  label="券后价价格"></el-table-column>
        <el-table-column prop="commissionPrice" width="100"  label="佣金"></el-table-column>
        <el-table-column prop="proportion" width="100"  label="佣金比例"></el-table-column>
        <el-table-column prop="sensationConsigneePhone" width="150" label="红人收样人手机号"></el-table-column>
        <el-table-column prop="sensationConsigneeName" width="150" label="红人收样人姓名"></el-table-column>
        <el-table-column prop="sensationConsigneeAddress" width="150" label="红人收样的地址"></el-table-column>
        <el-table-column prop="createDate" width="150" label="创建时间"></el-table-column>
        <el-table-column prop="enabled" width="200" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" v-if="scope.row.status===1" @click="examine(scope.row, 2)" type="primary">审核通过</el-button>
            <el-button size="mini" v-if="scope.row.status===1" @click="examine(scope.row)" type="primary">审核拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
      <cb-loading :show="$store.getters.loading"/>
    </div>
    <div class="my-table" v-show="type==='2'">
      <el-table :data="list" ref="table" style="width: 100%" height="100%" :stripe="true" highlight-current-row size="mini">
        <el-table-column fixed="left" prop="orderId" width="60" label="取样ID"></el-table-column>
        <el-table-column prop="phone" width="100"  label="红人手机号码"></el-table-column>
        <el-table-column prop="nickName" width="100" label="红人昵称"></el-table-column>
        <el-table-column prop="headPic" label="红人头像" width="90" >
          <template slot-scope="scope">
            <img style="width:80px" @click="prev(scope.$index,1)" :src="baseUrl + scope.row.headPic" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="status" width="100"  label="取样状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status">{{typeA[scope.row.status-1].name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="businessTitle" min-width="200" show-overflow-tooltip label="商品标题"></el-table-column>
        <el-table-column prop="mainPic" label="商品主图" width="90" >
          <template slot-scope="scope">
            <img style="width:80px" @click="prev(scope.$index,2)" :src="scope.row.mainPic" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="couponAfterPrice" width="100"  label="券后价价格"></el-table-column>
        <el-table-column prop="commissionPrice" width="100"  label="佣金"></el-table-column>
        <el-table-column prop="proportion" width="100"  label="佣金比例"></el-table-column>
        <el-table-column prop="sensationConsigneePhone" width="150" label="红人收样人手机号"></el-table-column>
        <el-table-column prop="sensationConsigneeName" width="150" label="红人收样人姓名"></el-table-column>
        <el-table-column prop="sensationConsigneeAddress" width="150" label="红人收样的地址"></el-table-column>
        <el-table-column prop="refuseContent" width="150" label="拒绝理由"></el-table-column>
        <el-table-column prop="checkDate" width="150" label="审核时间"></el-table-column>
        <el-table-column prop="createDate" width="150" label="创建时间"></el-table-column>
      </el-table>
      <cb-loading :show="$store.getters.loading"/>
    </div>
    <div class="my-table" v-show="type==='3'">
      <el-table :data="list" ref="table" style="width: 100%" height="100%" :stripe="true" highlight-current-row size="mini">
        <el-table-column fixed="left" prop="orderId" width="60" label="取样ID"></el-table-column>
        <el-table-column prop="phone" width="100"  label="红人手机号码"></el-table-column>
        <el-table-column prop="nickName" width="100" label="红人昵称"></el-table-column>
        <el-table-column prop="headPic" label="红人头像" width="90" >
          <template slot-scope="scope">
            <img style="width:80px" @click="prev(scope.$index,1)" :src="baseUrl + scope.row.headPic" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="status" width="100"  label="取样状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status">{{typeA[scope.row.status-1].name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="businessTitle" min-width="200" show-overflow-tooltip label="商品标题"></el-table-column>
        <el-table-column prop="mainPic" label="商品主图" width="90" >
          <template slot-scope="scope">
            <img style="width:80px" @click="prev(scope.$index,2)" :src="scope.row.mainPic" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="couponAfterPrice" width="100"  label="券后价价格"></el-table-column>
        <el-table-column prop="commissionPrice" width="100"  label="佣金"></el-table-column>
        <el-table-column prop="proportion" width="100"  label="佣金比例"></el-table-column>
        <el-table-column prop="sensationConsigneePhone" width="150" label="红人收样人手机号"></el-table-column>
        <el-table-column prop="sensationConsigneeName" width="150" label="红人收样人姓名"></el-table-column>
        <el-table-column prop="sensationConsigneeAddress" width="150" label="红人收样的地址"></el-table-column>
        <el-table-column prop="checkDate"  width="150" label="审核时间"></el-table-column>
        <el-table-column prop="createDate" width="150" label="创建时间"></el-table-column>
        <el-table-column prop="enabled" label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" v-if="scope.row.status===3" type="primary" @click="send(scope.row)">确认发样</el-button>
          </template>
        </el-table-column>
      </el-table>
      <cb-loading :show="$store.getters.loading"/>
    </div>
    <div class="my-table" v-show="type==='4'">
      <el-table :data="list" ref="table" style="width: 100%" height="100%" :stripe="true" highlight-current-row size="mini">
        <el-table-column fixed="left" prop="orderId" width="60" label="取样ID"></el-table-column>
        <el-table-column prop="phone" width="100"  label="红人手机号码"></el-table-column>
        <el-table-column prop="nickName" width="100" label="红人昵称"></el-table-column>
        <el-table-column prop="headPic" label="红人头像" width="90" >
          <template slot-scope="scope">
            <img style="width:80px" @click="prev(scope.$index,1)" :src="baseUrl + scope.row.headPic" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="status" width="100"  label="取样状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status">{{typeA[scope.row.status-1].name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="businessTitle" min-width="200" show-overflow-tooltip label="商品标题"></el-table-column>
        <el-table-column prop="mainPic" label="商品主图" width="90" >
          <template slot-scope="scope">
            <img style="width:80px" @click="prev(scope.$index,2)" :src="scope.row.mainPic" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="couponAfterPrice" width="100"  label="券后价价格"></el-table-column>
        <el-table-column prop="commissionPrice" width="100"  label="佣金"></el-table-column>
        <el-table-column prop="proportion" width="100"  label="佣金比例"></el-table-column>
        <el-table-column prop="sensationConsigneePhone" width="150" label="红人收样人手机号"></el-table-column>
        <el-table-column prop="sensationConsigneeName" width="150" label="红人收样人姓名"></el-table-column>
        <el-table-column prop="sensationConsigneeAddress" width="150" label="红人收样的地址"></el-table-column>
        <el-table-column prop="businessExpressName" width="150"  label="商家发样快递"></el-table-column>
        <el-table-column prop="businessNum" width="150" label="商家发样快递单号"></el-table-column>
        <el-table-column prop="businessExplain" show-overflow-tooltip width="150" label="商家寄回样品说明"></el-table-column>
        <el-table-column prop="businessDeliverDate" width="150" label="商家发样时间"></el-table-column>
        <el-table-column prop="checkDate" width="150" label="审核时间"></el-table-column>
        <el-table-column prop="createDate" width="150" label="创建时间"></el-table-column>
      </el-table>
      <cb-loading :show="$store.getters.loading"/>
    </div>
    <div class="my-table" v-show="type==='5'">
      <el-table :data="list" ref="table" style="width: 100%" height="100%" :stripe="true" highlight-current-row size="mini">
        <el-table-column fixed="left" prop="orderId" width="60" label="取样ID"></el-table-column>
        <el-table-column prop="phone" width="100"  label="红人手机号码"></el-table-column>
        <el-table-column prop="nickName" width="100" label="红人昵称"></el-table-column>
        <el-table-column prop="headPic" label="红人头像" width="90" >
          <template slot-scope="scope">
            <img style="width:80px" @click="prev(scope.$index,1)" :src="baseUrl + scope.row.headPic" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="status" width="100"  label="取样状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status">{{typeA[scope.row.status-1].name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="businessTitle" min-width="200" show-overflow-tooltip label="商品标题"></el-table-column>
        <el-table-column prop="mainPic" label="商品主图" width="90" >
          <template slot-scope="scope">
            <img style="width:80px" @click="prev(scope.$index,2)" :src="scope.row.mainPic" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="couponAfterPrice" width="100"  label="券后价价格"></el-table-column>
        <el-table-column prop="commissionPrice" width="100"  label="佣金"></el-table-column>
        <el-table-column prop="proportion" width="100"  label="佣金比例"></el-table-column>
        <el-table-column prop="sensationConsigneePhone" width="150" label="红人收样人手机号"></el-table-column>
        <el-table-column prop="sensationConsigneeName" width="150" label="红人收样人姓名"></el-table-column>
        <el-table-column prop="sensationConsigneeAddress" width="150" label="红人收样的地址"></el-table-column>
        <el-table-column prop="businessExpressName" width="150" label="商家发样快递"></el-table-column>
        <el-table-column prop="businessNum" width="150" label="商家发样快递单号"></el-table-column>
        <el-table-column prop="businessExplain" show-overflow-tooltip width="150" label="商家寄回样品说明"></el-table-column>
        <el-table-column prop="businessDeliverDate" width="150" label="商家发样时间"></el-table-column>
        <el-table-column prop="sensationReceivingDate" width="150" label="红人收样时间"></el-table-column>
        <el-table-column prop="checkDate" width="150" label="审核时间"></el-table-column>
        <el-table-column prop="createDate" width="150" label="创建时间"></el-table-column>
      </el-table>
      <cb-loading :show="$store.getters.loading"/>
    </div>
    <div class="my-table" v-show="type==='6'">
      <el-table :data="list" ref="table" style="width: 100%" height="100%" :stripe="true" highlight-current-row size="mini">
        <el-table-column fixed="left" prop="orderId" width="60" label="取样ID"></el-table-column>
        <el-table-column prop="phone" width="100"  label="红人手机号码"></el-table-column>
        <el-table-column prop="nickName" width="100" label="红人昵称"></el-table-column>
        <el-table-column prop="headPic" label="红人头像" width="90" >
          <template slot-scope="scope">
            <img style="width:80px" @click="prev(scope.$index,1)" :src="baseUrl + scope.row.headPic" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="status" width="100"  label="取样状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status">{{typeA[scope.row.status-1].name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="businessTitle" min-width="200" show-overflow-tooltip label="商品标题"></el-table-column>
        <el-table-column prop="mainPic" label="商品主图" width="90" >
          <template slot-scope="scope">
            <img style="width:80px" @click="prev(scope.$index,2)" :src="scope.row.mainPic" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="couponAfterPrice" width="100"  label="券后价价格"></el-table-column>
        <el-table-column prop="commissionPrice" width="100"  label="佣金"></el-table-column>
        <el-table-column prop="proportion" width="100"  label="佣金比例"></el-table-column>
        <el-table-column prop="sensationConsigneePhone" width="150" label="红人收样人手机号"></el-table-column>
        <el-table-column prop="sensationConsigneeName" width="150" label="红人收样人姓名"></el-table-column>
        <el-table-column prop="sensationConsigneeAddress" width="150" label="红人收样的地址"></el-table-column>
        <el-table-column prop="businessExpressName" width="150" label="商家发样快递"></el-table-column>
        <el-table-column prop="businessNum" width="150" label="商家发样快递单号"></el-table-column>
        <el-table-column prop="businessExplain" show-overflow-tooltip width="150" label="商家寄回样品说明"></el-table-column>
        <el-table-column prop="sensationExpressName" width="150" label="红人发样快递公司"></el-table-column>
        <el-table-column prop="businessDeliverDate" width="150" label="商家发样时间"></el-table-column>
        <el-table-column prop="sensationReceivingDate" width="150" label="红人收样时间"></el-table-column>
        <el-table-column prop="sensationSendDate" width="150" label="红人寄样时间"></el-table-column>
        <el-table-column prop="checkDate" width="150" label="审核时间"></el-table-column>
        <el-table-column prop="createDate" width="150" label="创建时间"></el-table-column>
        <el-table-column prop="enabled" label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" v-if="scope.row.status===6" type="primary" @click="take(scope.row)">确认收样</el-button>
          </template>
        </el-table-column>
      </el-table>
      <cb-loading :show="$store.getters.loading"/>
    </div>
    <div class="my-table" v-show="type==='7'">
      <el-table :data="list" ref="table" style="width: 100%" height="100%" :stripe="true" highlight-current-row size="mini">
        <el-table-column fixed="left" prop="orderId" width="60" label="取样ID"></el-table-column>
        <el-table-column prop="phone" width="100"  label="红人手机号码"></el-table-column>
        <el-table-column prop="nickName" width="100" label="红人昵称"></el-table-column>
        <el-table-column prop="headPic" label="红人头像" width="90" >
          <template slot-scope="scope">
            <img style="width:80px" @click="prev(scope.$index,1)" :src="baseUrl + scope.row.headPic" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="status" width="100"  label="取样状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status">{{typeA[scope.row.status-1].name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="businessTitle" min-width="200" show-overflow-tooltip label="商品标题"></el-table-column>
        <el-table-column prop="mainPic" label="商品主图" width="90" >
          <template slot-scope="scope">
            <img style="width:80px" @click="prev(scope.$index,2)" :src="scope.row.mainPic" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="couponAfterPrice" width="100"  label="券后价价格"></el-table-column>
        <el-table-column prop="commissionPrice" width="100"  label="佣金"></el-table-column>
        <el-table-column prop="proportion" width="100"  label="佣金比例"></el-table-column>
        <el-table-column prop="sensationConsigneePhone" width="150" label="红人收样人手机号"></el-table-column>
        <el-table-column prop="sensationConsigneeName" width="150" label="红人收样人姓名"></el-table-column>
        <el-table-column prop="sensationConsigneeAddress" width="150" label="红人收样的地址"></el-table-column>
        <el-table-column prop="businessExpressName" width="150" label="商家发样快递"></el-table-column>
        <el-table-column prop="businessNum" width="150" label="商家发样快递单号"></el-table-column>
        <el-table-column prop="businessExplain" show-overflow-tooltip width="150" label="商家寄回样品说明"></el-table-column>
        <el-table-column prop="sensationExpressName" width="150" label="红人发样快递公司"></el-table-column>
        <el-table-column prop="businessDeliverDate" width="150" label="商家发样时间"></el-table-column>
        <el-table-column prop="sensationReceivingDate"  width="150" label="红人收样时间"></el-table-column>
        <el-table-column prop="sensationSendDate" width="150" label="红人寄样时间"></el-table-column>
        <el-table-column prop="businessCollectDate"  width="150" label="商家收样时间"></el-table-column>
        <el-table-column prop="checkDate" width="150" label="审核时间"></el-table-column>
        <el-table-column prop="createDate" width="150" label="创建时间"></el-table-column>
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
    <v-dialog :width="500" :zIndex="10" :dialogShow="dialogFormVisible" title="领样审核">
      <i slot="close" class="el-icon-close close" @click="dialogFormVisible=false"></i>
      <div slot="con">
        <el-form ref="form" label-width="100px">
          <el-form-item label="审核备注" prop="area">
            <span style="position:absolute;left:-77px;color:#eb453c;">*</span>
            <el-input style="width: 370px" rows="5" type="textarea" v-model="refuseContent" placeholder="请输入审核备注"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer-btn" slot="footer-btn">
        <el-button @click="dialogFormVisible=false">取消</el-button>
        <el-button type="primary" :disabled="cansubmit" :loading="subLoad" @click="submit">{{submitTitle}}</el-button>
      </div>
    </v-dialog>
    <v-dialog :width="500" :zIndex="10" :dialogShow="dialogFormVisible1" title="发样">
      <i slot="close" class="el-icon-close close" @click="dialogFormVisible1=false"></i>
      <div slot="con">
        <el-form ref="form" label-width="85px">
          <el-form-item label="快递公司" prop="area">
            <span style="position:absolute;left:-77px;color:#eb453c;">*</span>
            <el-select style="width: 370px" v-model="form.businessExpressId" placeholder="请选择快递公司">
              <el-option v-for="(item, index) in expressList" :key="index" :label="item.expressName" :value="item.expressId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="快递单号" prop="area">
            <span style="position:absolute;left:-77px;color:#eb453c;">*</span>
            <el-input style="width: 370px" v-model="form.businessNum" placeholder="请输入快递单号"></el-input>
          </el-form-item>
          <el-form-item label="发样说明" prop="area">
            <span style="position:absolute;left:-77px;color:#eb453c;">*</span>
            <el-input style="width: 370px" rows="5" type="textarea" v-model="form.businessExplain" placeholder="请输入审核备注"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer-btn" slot="footer-btn">
        <el-button @click="dialogFormVisible1=false">取消</el-button>
        <el-button type="primary" :disabled="cansubmit1" :loading="subLoad" @click="submit1">{{submitTitle}}</el-button>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import cbLoading from '@c/loading'
import vDialog from '@c/dialog'
import { baseUrl } from '@/utils/commom'
import { orderList, checkOrder, sendOrder, collectOrder, expressList } from '@/api'
export default {
  data () {
    return {
      type: '0',
      dialogFormVisible: false,
      dialogFormVisible1: false,
      requestData: { pageNum: 1, pageSize: 20, businessTitle: '', status: 1 },
      list: [],
      total: 0,
      subLoad: false,
      baseUrl: baseUrl,
      submitTitle: '确定',
      refuseContent: '',
      expressList: [],
      form: { orderId: '', businessExpressId: '', businessNum: '', businessExplain: '' },
      typeA: [{ type: 1, name: '领样等待审核' }, { type: 2, name: '领样审核失败' }, { type: 3, name: '领样待发样' }, { type: 4, name: '领养已发样' }, { type: 5, name: '红人已收样' }, { type: 6, name: '红人寄回样中' }, { type: 7, name: '领养已收样' }]
    }
  },
  components: {
    cbLoading,
    vDialog
  },
  computed: {
    cansubmit: function () {
      return (this.refuseContent === '' || this.subLoad)
    },
    cansubmit1: function () {
      return (this.orderId === '' || this.businessExpressId === '' || this.businessNum === '' || this.businessExplain === '' || this.subLoad)
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
    search () {
      this.requestData.pageNum = 1
      this.getList()
    },
    refresh () {
      this.requestData.pageNum = 1
      this.getList()
    },
    async getList () {
      const res = await orderList(this.requestData)
      if (res.result === '0') {
        this.list = res.datas.list
        this.total = res.datas.totalRow
        this.$nextTick(() => {
          this.$refs.table.doLayout()
        })
      }
    },
    examine (row, type) {
      this.row = row
      if (type) {
        this.$confirm('该操作将审核通过取样申请,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await checkOrder({ orderId: this.row.orderId, status: 1 })
          if (res.result === '1') {
            this.getList()
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '操作取消'
          })
        })
      } else {
        this.dialogFormVisible = true
      }
    },
    submit () {
      if (this.cansubmit) return
      this.subLoad = true
      this.submitTitle = '提交中...'
      setTimeout(() => {
        this.create()
      }, 700)
    },
    create () {
      this.$confirm('该操作将驳回取样申请,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await checkOrder({ orderId: this.row.orderId, status: 2, refuseContent: this.refuseContent })
        if (res.result === '1') {
          this.dialogFormVisible = false
          this.getList()
        }
        this.subLoad = false
        this.submitTitle = '确定'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消'
        })
        this.subLoad = false
        this.submitTitle = '确定'
      })
    },
    submit1 () {
      if (this.cansubmit1) return
      this.subLoad = true
      this.submitTitle = '提交中...'
      setTimeout(() => {
        this.create1()
      }, 700)
    },
    async create1 () {
      const res = await sendOrder({ orderId: this.row.orderId, businessExpressId: this.form.businessExpressId, businessNum: this.form.businessNum, businessExplain: this.form.businessExplain })
      if (res.result === '1') {
        this.dialogFormVisible1 = false
        this.getList()
      }
      this.submitTitle = '确定'
      this.subLoad = false
    },
    send (row) {
      this.row = row
      this.dialogFormVisible1 = true
      this.form = { orderId: '', businessExpressId: '', businessNum: '', businessExplain: '' }
    },
    take (row) {
      this.$confirm('该操作将进行收样操作,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await collectOrder({ orderId: row.orderId })
        if (res.result === '1') {
          this.getList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消'
        })
      })
    },
    prev (index, type) {
      const srcs = this.list.map(item => {
        if (type === 1) {
          return this.baseUrl + item.headPic
        } else {
          return this.baseUrl + item.mainPic
        }
      })
      this.$store.commit('prevData', { show: true, data: { index: index, srcs: srcs } })
    },
    async getexpressList () {
      const res = await expressList({})
      if (res.result === '0') {
        this.expressList = res.datas.list
      }
    }
  },
  created () {
    this.type = '1'
    this.getexpressList()
  },
  watch: {
    type: function (val) {
      this.requestData.status = val
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
