'use babel'

import { CompositeDisposable } from 'atom'
import { SelectListView } from 'atom-space-pen-views'

export default class TabListView extends SelectListView {
  constructor(tabControllers = []) {
    super()
    this.setItems(tabControllers)
    this.addClass('overlay from-top')
    this.panel = atom.workspace.addModalPanel({ item: this })
  }
  viewForItem(tabController) {
    const title = tabController.panes[0].getActiveItem().getTitle()
    return `<li>${title}</li>`
  }
  show() {
    this.panel.show()
    this.focusFilterEditor()
  }
  confirmed(tabContoller) {
    console.log(`${tabContoller} was selected`)
    // 選択されたtabContollerをfindしてindexが分かれば楽勝そう
  }
  cancelled() {
    console.log('This view was cancelled')
    this.panel.hide()
  }
}
