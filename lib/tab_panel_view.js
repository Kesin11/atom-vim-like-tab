'use babel'

import { View } from 'atom-space-pen-views'

export default class TabPanelView extends View {
  // static class method for space-pen module contract
  static content() {
    this.div({ class: 'atom-vim-like-tab' }, () => {
      this.div({ class: 'top-panel', outlet: 'top_panel_text' })
    })
  }

  constructor(tabControllers = []) {
    super()
    this.tabControllers = tabControllers
  }

  updateTabName() {
    if (this.tabControllers.length < 2) return

    const tabName = this.tabControllers.map((tabController, i) => {
      const item = tabController.panes[0].getActiveItem()
      const firstPaneName = (item) ? item.getTitle() : 'No Name'
      return `${i + 1} ${firstPaneName}`
    }).join(' ')
    this.top_panel_text.text(tabName)
  }
}
