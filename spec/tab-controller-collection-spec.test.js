'use babel'

import { expect } from 'chai'
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

    expect(tabControllerCollection.tabControllers[0]).to.equal(tabController)
  })

  it('remove', () => {
    const firstTabController = new TabController()
    const secondTabController = new TabController()
    tabControllerCollection.add(firstTabController)
    tabControllerCollection.add(secondTabController)

    tabControllerCollection.remove(firstTabController)

    expect(tabControllerCollection.tabControllers[0]).to.equal(secondTabController)

    expect(tabControllerCollection).to.have.lengthOf(1)
  })

  it('length', () => {
    expect(tabControllerCollection).to.have.lengthOf(0)

    const tabController = new TabController()
    tabControllerCollection.add(tabController)

    expect(tabControllerCollection).to.have.lengthOf(1)
  })

  it('destroy', () => {
    const firstTabController = new TabController()
    const secondTabController = new TabController()
    tabControllerCollection.add(firstTabController)
    tabControllerCollection.add(secondTabController)

    tabControllerCollection.destroy()

    expect(tabControllerCollection.tabControllers).to.have.lengthOf(0)

    expect(tabControllerCollection).to.have.lengthOf(0)
  })
})
