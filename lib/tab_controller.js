'use babel'

import { CompositeDisposable } from 'atom'
import _ from 'underscore-plus'

export default class TabController {
  constructor(panes = []) {
    this.subscriptions = new CompositeDisposable()
    this.panes = panes
    this.activate()

    this.subscriptions.add(
      atom.workspace.onDidAddPane((event) => {
        if (!this.isActive) return

        console.log('add pane')
        this.panes.push(event.pane)
        console.log(this.panes)

        this.subscriptions.add(this.paneSubscriptions(event.pane))
      })
    )
  }

  paneSubscriptions(pane) {
    const paneSubscriptions = new CompositeDisposable()

    paneSubscriptions.add(
      pane.onDidDestroy(() => {
        _.remove(this.panes, pane)
        console.log(this.panes)
      })
    )
    paneSubscriptions.add(
      pane.onDidDestroy(() => {
        console.log('pane on did destory')
        paneSubscriptions.dispose()
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
    console.log('destroy contloller')
    this.subscriptions.dispose()
  }
}
