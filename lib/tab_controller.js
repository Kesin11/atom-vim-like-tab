'use babel'

import { CompositeDisposable } from 'atom'
import _ from 'underscore-plus'

export default class TabController {
  constructor() {
    this.subscriptions = new CompositeDisposable()
    this.panes = []

    this.subscriptions.add(
      atom.workspace.observePanes((pane) => {
        console.log('add pane')
        this.panes.push(pane)
        console.log(this.panes)

        this.subscriptions.add(this.paneSubscriptions(pane))
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
  }

  hide() {
    this.panes.forEach((pane) => {
      const view = atom.views.getView(pane)
      view.style.display = 'none'
    })
  }

  destroy() {
    console.log('destroy contloller')
    this.subscriptions.dispose()
  }
}
