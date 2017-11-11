'use babel'

import AtomVimLikeTab from '../lib/atom-vim-like-tab'
import { expect } from 'chai'
import * as path from 'path'
import {
  getTabControllers,
  getFirstTabController,
  getLastTabController,
  dispatchCommand,
} from './spec-helper.js'
import TabController from '../lib/tab_controller'
import _ from 'underscore-plus'

describe('AtomVimLikeTab', () => {
  let atomVimLikeTab
  beforeEach(async () => {
      atomVimLikeTab = new AtomVimLikeTab()
      await atomVimLikeTab.activate()
      await atom.workspace.open(path.join(__dirname, 'fixtures', 'dummy.txt'))
  })

  afterEach(() => {
    atomVimLikeTab.deactivate()
  })

  describe('activation', () => {
    describe('when activated', () => {
      it('has one tabContoller', () => {
        expect(getTabControllers(atomVimLikeTab)).to.have.lengthOf(1)

        expect(getFirstTabController(atomVimLikeTab)).to.be.instanceOf(TabController)
      })
    })

    describe('when deactivated', () => {
      beforeEach(() => {
        atomVimLikeTab.deactivate()
      })

      it('subscriptions should be disposed', () => {
        expect(atomVimLikeTab.subscriptions.disposed).to.be.true
      })

      it('tabControllers should be empty', () => {
        expect(getTabControllers(atomVimLikeTab)).to.have.lengthOf(0)
      })
    })

    describe('when deactivate with config "dontRestoreInactiveTabsPane"', () => {
      let inactivePaneIds = undefined
      let activePaneId = undefined

      beforeEach(async () => {
        atom.config.set('atom-vim-like-tab.dontRestoreInactiveTabsPane', true)
        dispatchCommand('atom-vim-like-tab:new')
        dispatchCommand('atom-vim-like-tab:new')
        dispatchCommand('atom-vim-like-tab:new')
        inactivePaneIds = getTabControllers(atomVimLikeTab)
          .filter(tabController => !tabController.isActive)
          .map(tabController => tabController.panes[0].id)
        activePaneId = getLastTabController(atomVimLikeTab).panes[0].id

        atomVimLikeTab.deactivate()

        // hack for pane.close() called by atom-vim-like-tab:close completly done.
        // because dispatchCommand() can't return promise.
        await new Promise(resolve => setTimeout(resolve, 100))
      })

      it('inactive tabs pane should be closed', () => {
        const paneIds = atom.workspace.getCenter().getPanes().map(pane => pane.id)

        expect(paneIds).to.contain(activePaneId)

        for (const inactivePaneId of inactivePaneIds) {
          expect(paneIds).to.not.contain(inactivePaneId)
        }
      })
    })
  })

  describe('dispatch command', () => {
    describe('new', () => {

      it('tabControllers should be have new controller', () => {
        const beforeControllersNum = getTabControllers(atomVimLikeTab).length
        dispatchCommand('atom-vim-like-tab:new')

        expect(getTabControllers(atomVimLikeTab)).to.have.lengthOf.above(beforeControllersNum)
      })

      it('old pane should be hide', () => {
        dispatchCommand('atom-vim-like-tab:new')

        const oldController = getFirstTabController(atomVimLikeTab)

        expect(
          oldController.getPaneViews().every(
            (view) => view.style.display === 'none'
          )).to.be.true
      })

      it('new tabControllers should be have another pane', () => {
        const beforePanes = getFirstTabController(atomVimLikeTab).panes
        dispatchCommand('atom-vim-like-tab:new')

        const newPane = _.first(getLastTabController(atomVimLikeTab).panes)

        expect(beforePanes).to.not.contain(newPane)
      })

      it('new pane should be managed new tabContoller after new command', () => {
        dispatchCommand('atom-vim-like-tab:new')
        atom.workspace.getCenter().getActivePane().splitRight()
        const newPane = atom.workspace.getCenter().getActivePane()

        const oldControllerPanes = getFirstTabController(atomVimLikeTab).panes
        const newControllerPanes = getLastTabController(atomVimLikeTab).panes

        expect(oldControllerPanes).to.not.contain(newPane)

        expect(newControllerPanes).to.contain(newPane)
      })
    })

    describe('next', () => {
      beforeEach(() => {
        dispatchCommand('atom-vim-like-tab:new')
      })

      it('current tab should be hide', () => {
        const beforeShowIndex = atomVimLikeTab.showIndex
        dispatchCommand('atom-vim-like-tab:next')

        const previousController = getTabControllers(atomVimLikeTab)[beforeShowIndex]

        expect(
          previousController.getPaneViews().every(
            (view) => view.style.display === 'none'
          )).to.be.true
      })

      it('next tab should be show', () => {
        dispatchCommand('atom-vim-like-tab:next')
        const showIndex = atomVimLikeTab.showIndex
        const nextController = getTabControllers(atomVimLikeTab)[showIndex]

        expect(nextController.getPaneViews().every(
          (view) => view.style.display === ''
        )).to.be.true
      })

      it('next tab pane should be activated', () => {
        dispatchCommand('atom-vim-like-tab:next')
        const showIndex = atomVimLikeTab.showIndex
        const nextController = getTabControllers(atomVimLikeTab)[showIndex]

        expect(nextController.panes[0]).to.be.eql(atom.workspace.getCenter().getActivePane())
      })
    })

    describe('close', () => {
      describe('when before create new tab', () => {

        it('last TabController should not be removed', async () => {
          const initController = getFirstTabController(atomVimLikeTab)
          dispatchCommand('atom-vim-like-tab:close')
          // hack for pane.close() called by atom-vim-like-tab:close completly done.
          // because dispatchCommand() can't return promise.
          await new Promise(resolve => setTimeout(resolve, 100))

          expect(initController.panes).to.have.lengthOf(1)

          expect(getTabControllers(atomVimLikeTab)).to.contain(initController)
        })
      })

      describe('when after carete new tab', () => {
        let currentController = null
        beforeEach(async () => {
          dispatchCommand('atom-vim-like-tab:new')
          currentController = getLastTabController(atomVimLikeTab)

          dispatchCommand('atom-vim-like-tab:close')
          // hack for pane.close() called by atom-vim-like-tab:close completly done.
          // because dispatchCommand() can't return promise.
          await new Promise(resolve => setTimeout(resolve, 100))
        })

        it('current TabController should be removed', () => {

          expect(currentController.panes).to.have.lengthOf(0)

          expect(getTabControllers(atomVimLikeTab)).not.to.contain(currentController)
        })

        it('previous panes should be show', () => {
          const showIndex = atomVimLikeTab.showIndex
          const previousController = getTabControllers(atomVimLikeTab)[showIndex]

          expect(previousController.getPaneViews().every(
            (view) => view.style.display === ''
          )).to.be.true
        })

        it('previous tab pane should be activated', () => {
          const showIndex = atomVimLikeTab.showIndex
          const previousController = getTabControllers(atomVimLikeTab)[showIndex]

          expect(previousController.panes[0]).to.be.eql(atom.workspace.getCenter().getActivePane())
        })
      })
    })

    describe('triggered by outside action', () => {
      describe('when all panes are closed', () => {
        it('unnecessary tabController should be removed', async () => {
          // create new tab and then close all pane
          dispatchCommand('atom-vim-like-tab:new')
          const newController = getLastTabController(atomVimLikeTab)
          const closePromises = newController.panes.map((pane) => pane.close())

          await Promise.all(closePromises)

          expect(getTabControllers(atomVimLikeTab)).not.to.contain(newController)
        })
      })
    })
  })
})
