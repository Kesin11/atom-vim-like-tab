'use babel'

import { View } from 'atom-space-pen-views'

export default class TabPanelView extends View {
  // static class method for space-pen module contract
  static content() {
    this.div({ class: 'atom-vim-like-tab' }, () => {
      this.div({ class: 'top-panel', outlet: 'top_panel_list' }, () => {})
    })
  }

  constructor(tabControllers = []) {
    super()
    this.tabControllers = tabControllers
  }

  updateTabName() {
    if (!atom.config.get('atom-vim-like-tab.enableTopTabPanel')) return

    this.top_panel_list.empty()
    if (this.tabControllers.length < 2) return

    const tabNameElements = this.tabControllers.map((tabController, i) => {
      const item = tabController.panes[0].getActiveItem()
      const firstPaneName = (item) ? item.getTitle() : 'No Name'
      const cssClass = (tabController.isActive) ? 'active' : ''
      return `<span class=${cssClass}>${i + 1} ${firstPaneName}</span>`
    }).join('')
    this.top_panel_list.append(tabNameElements)
  }
}
