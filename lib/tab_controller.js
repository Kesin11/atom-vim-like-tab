'use babel'

import { CompositeDisposable } from 'atom'

export default class TabController {
  constructor(pane) {
    this.subscriptions = new CompositeDisposable()
    this.pane = pane

    this.subscriptions.add(pane.onDidDestroy(() => {
      console.log('pane on did destory')
      this.subscriptions.dispose()
    }))
  }
  destroy() {
    console.log('destroy contloller')
    this.subscriptions.dispose()
  }
}
