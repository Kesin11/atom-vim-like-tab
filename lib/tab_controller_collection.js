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
    this.emitter.emit('did-change-tabControllers', this)

    // when close all panes destory corresponding tabController
    tabController.onDidPanesEmpty((tabController) => {
      tabController.destroy()
      this.remove(tabController)
      if (this.length > 0) this.emitter.emit('did-panes-empty')
    })
  }

  remove(tabController) {
    _.remove(this.tabControllers, tabController)
    this._updateLength()
    this.emitter.emit('did-change-tabControllers', this)
  }

  onDidChange(callback) {
    this.emitter.on('did-change-tabControllers', callback)
  }

  onDidPanesEmpty(callback) {
    this.emitter.on('did-panes-empty', callback)
  }

  _updateLength() {
    this.length = this.tabControllers.length
  }
}
