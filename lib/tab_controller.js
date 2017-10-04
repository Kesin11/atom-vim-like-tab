'use babel'

import { Emitter, CompositeDisposable } from 'atom'
import _ from 'underscore-plus'

export default class TabController {
  constructor(panes = []) {
    this.subscriptions = new CompositeDisposable
    this.emitter = new Emitter
    this.panes = []
    this.activate()

    // add subscriptions for init panes
    panes.forEach((pane) => {
      this.panes.push(pane)
      this.subscriptions.add(this.paneSubscriptions(pane))
    })

    this.subscriptions.add(
      atom.workspace.getCenter().onDidAddPane((event) => {
        if (!this.isActive) return

        this.panes.push(event.pane)
        this.subscriptions.add(this.paneSubscriptions(event.pane))
      })
    )
  }

  destroy() {
    this.subscriptions.dispose()
  }

  paneSubscriptions(pane) {
    const paneSubscriptions = new CompositeDisposable()

    paneSubscriptions.add(
      pane.onDidDestroy(() => {
        _.remove(this.panes, pane)
        paneSubscriptions.dispose()

        if (_.isEmpty(this.panes)) this.emitter.emit('did-pane-empty', this)
      })
    )
    return paneSubscriptions
  }

  show() {
    this.panes.forEach((pane) => {
      const view = atom.views.getView(pane)
      view.style.display = ''
    })
    this.activate()
    if (!_.isUndefined(this.panes[0])) {
      this.panes[0].activate()
    }
  }

  hide() {
    this.panes.forEach((pane) => {
      const view = atom.views.getView(pane)
      view.style.display = 'none'
    })
    this.deactivate()
  }

  activate() {
    this.isActive = true
  }

  deactivate() {
    this.isActive = false
  }

  closeAllPanes() {
    // copy panes because pane.close() will remove pane from this.panes.
    // forEach will broken when removing iterate object.
    const panes = this.panes.concat()
    panes.forEach(async (pane) => await pane.close())
  }

  onDidPanesEmpty(callback) {
    this.emitter.on('did-pane-empty', callback)
  }

  getPaneViews() {
    return this.panes.map((pane) => atom.views.getView(pane))
  }
}
