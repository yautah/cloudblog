import Global from './global.js'
import Home from './home.js'

class Store {
  constructor() {
    this.globalStore = Global
    this.homeStore = Home
  }
}

export default Store
