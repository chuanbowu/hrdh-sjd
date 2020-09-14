const routeArr = {
  state: {
    loading: false,
    authPower: [],
    routerMenu: [],
    prevData: { show: false, data: { index: 0, srcs: [] } }
  },
  mutations: {
    UPDATE_LOADING: (state, loading) => {
      state.loading = loading
    },
    authPower: (state, arr) => {
      state.authPower = arr
    },
    ROUTER_MENU: (state, arr) => {
      state.routerMenu = arr
    },
    prevData: (state, param) => {
      state.prevData = param
    }
  }
}
export default routeArr
