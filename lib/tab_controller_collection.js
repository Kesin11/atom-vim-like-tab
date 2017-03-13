'use babel'

import { Emitter, CompositeDisposable } from 'atom'
import _ from 'underscore-plus'

export default class TabControllerCollection {
  constructor() {
    this.subscriptions = new CompositeDisposable()
    this.emitter = new Emitter()
    this.length = 0
    this.tabControllers = []
  }

  destroy() {
    this.subscriptions.dispose()
    this.tabControllers.forEach((tabController) => { tabController.destroy() })
    this.tabControllers = []
    this._updateLength()
  }

  add(tabController) {
    this.tabControllers.push(tabController)
    this._updateLength()
  }

  remove(tabController) {
    _.remove(this.tabControllers, tabController)
    this._updateLength()
  }

  _updateLength() {
    this.length = this.tabControllers.length
  }
}
