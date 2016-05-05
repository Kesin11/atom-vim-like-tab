'use babel'

import { Emitter, CompositeDisposable } from 'atom'
import _ from 'underscore-plus'

export default class TabController {
  constructor(panes = []) {
    this.subscriptions = new CompositeDisposable
    this.emitter = new Emitter
    this.panes = panes
    this.activate()

    this.subscriptions.add(
      atom.workspace.onDidAddPane((event) => {
        if (!this.isActive) return

        this.panes.push(event.pane)
        this.subscriptions.add(this.paneSubscriptions(event.pane))
      })
    )
  }

  paneSubscriptions(pane) {
    const paneSubscriptions = new CompositeDisposable()

    paneSubscriptions.add(
      pane.onDidDestroy(() => {
        _.remove(this.panes, pane)
        paneSubscriptions.dispose()

        if (this.panes.length === 0) this.emitter.emit('did-pane-empty', this)
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
    if (this.panes[0]) atom.workspace.paneContainer.setActivePane(this.panes[0])
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

  destroy() {
    this.subscriptions.dispose()
  }

  onDidPanesEmpty(callback) {
    this.emitter.on('did-pane-empty', callback)
  }
}
