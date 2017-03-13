'use babel'

import TabController from '../lib/tab_controller'
import TabControllerCollection from '../lib/tab_controller_collection'

describe('tabControllerCollection', () => {
  let tabControllerCollection = null
  beforeEach(() => {
    tabControllerCollection = new TabControllerCollection()
  })
  afterEach(() => {
  })

  it('add', () => {
    const tabController = new TabController()
    tabControllerCollection.add(tabController)

    expect(tabControllerCollection.tabControllers[0]).toBe(tabController)
  })
  it('remove', () => {
    const firstTabController = new TabController()
    const secondTabController = new TabController()
    tabControllerCollection.add(firstTabController)
    tabControllerCollection.add(secondTabController)

    tabControllerCollection.remove(firstTabController)

    expect(tabControllerCollection.tabControllers[0]).toBe(secondTabController)
    expect(tabControllerCollection.length).toBe(1)
  })
  it('length', () => {
    expect(tabControllerCollection.length).toBe(0)

    const tabController = new TabController()
    tabControllerCollection.add(tabController)

    expect(tabControllerCollection.length).toBe(1)
  })
  it('destroy', () => {
    const firstTabController = new TabController()
    const secondTabController = new TabController()
    tabControllerCollection.add(firstTabController)
    tabControllerCollection.add(secondTabController)

    tabControllerCollection.destroy()

    expect(tabControllerCollection.tabControllers).toHaveLength(0)
    expect(tabControllerCollection.length).toBe(0)
  })
})
