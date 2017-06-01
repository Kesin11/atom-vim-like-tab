/** @babel */
/** @jsx etch.dom */

import etch from 'etch'

export default class TabPanelView {
  render() {
    return (
      <div className='atom-vim-like-tab'>
        <div className='top-panel'>
          {this.props.tabs.map(tab => <span className={tab.class}>{tab.value}</span>)}
        </div>
      </div>
    )
  }

  constructor(tabControllerCollection) {
    this.tabControllerCollection = tabControllerCollection
    this.props = { tabs: [] }

    // subscriptions
    this.tabControllerCollection.onDidChange(() => this.update())
    atom.workspace.getCenter().observeActivePaneItem(() => this.update())

    etch.initialize(this)
  }

  destory() {
    return etch.destory(this)
  }

  update() {
    if (!atom.config.get('atom-vim-like-tab.enableTopTabPanel')) return

    this.props.tabs = this.tabControllerCollection.tabControllers.map((tabController, i) => {
      const item = tabController.panes[0].getActiveItem()
      const firstPaneName = (item) ? item.getTitle() : 'No Name'
      const cssClass = (tabController.isActive) ? 'active' : ''
      return {
        value: `${i + 1} ${firstPaneName}`,
        class: cssClass,
      }
    })

    // don't show tab_panel when only one tab
    if (this.tabControllerCollection.length < 2) {
      this.props.tabs = []
    }
    etch.update(this)
  }
}
