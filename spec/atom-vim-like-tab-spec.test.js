'use babel'

import { expect } from 'chai'
import * as path from 'path'
import {
  // getMain,
  getTabControllers,
  // getFirstTabController,
  // getLastTabController,
  // dispatchCommand,
} from './spec-helper.js'
import TabController from '../lib/tab_controller'
// import _ from 'underscore-plus'

describe('AtomVimLikeTab', () => {
  beforeEach(async () => {
      global.atom = global.buildAtomEnvironment({
        configDirPath: process.env.ATOM_HOME,
        enablePersistence: false
      })

      await atom.workspace.open(path.join(__dirname, 'fixtures', 'dummy.txt'))
      await atom.packages.activatePackage('atom-vim-like-tab')
  })

  afterEach(() => {
    atom.packages.deactivatePackage('atom-vim-like-tab')
  })

  describe('activation', () => {
    describe('when activated', () => {
      it('has one tabContoller', () => {
        expect(getTabControllers()).to.have.lengthOf(1)

        expect(getTabControllers()[0]).to.be.instanceOf(TabController)
      })
    })
  //
  //   describe('when deactivated', () => {
  //     beforeEach(() => {
  //       atom.packages.deactivatePackage('atom-vim-like-tab')
  //     })
  //
  //     it('subscriptions should be disposed', () => {
  //       expect(getMain().subscriptions.disposed).to.be.true
  //     })
  //
  //     it('tabControllers should be empty', () => {
  //       expect(getTabControllers()).to.have.lengthOf(0)
  //     })
  //   })
  //
  //   describe('when deactivate with config "dontRestoreInactiveTabsPane"', () => {
  //     let inactivePaneIds = undefined
  //     let activePaneId = undefined
  //
  //     beforeEach(async () => {
  //       atom.config.set('atom-vim-like-tab.dontRestoreInactiveTabsPane', true)
  //       dispatchCommand('atom-vim-like-tab:new')
  //       dispatchCommand('atom-vim-like-tab:new')
  //       dispatchCommand('atom-vim-like-tab:new')
  //       inactivePaneIds = getTabControllers()
  //         .filter(tabController => !tabController.isActive)
  //         .map(tabController => tabController.panes[0].id)
  //       activePaneId = getLastTabController().panes[0].id
  //
  //       atom.packages.deactivatePackage('atom-vim-like-tab')
  //
  //       // hack for pane.close() called by atom-vim-like-tab:close completly done.
  //       // because dispatchCommand() can't return promise.
  //       await new Promise(resolve => setTimeout(resolve, 100))
  //     })
  //
  //     it('inactive tabs pane should be closed', () => {
  //       const paneIds = atom.workspace.getCenter().getPanes().map(pane => pane.id)
  //
  //       expect(paneIds).toContain(activePaneId)
  //
  //       for (const inactivePaneId of inactivePaneIds) {
  //         expect(paneIds).to.not.contain(inactivePaneId)
  //       }
  //     })
    // })
  })

  // describe('dispatch command', () => {
  //   describe('new', () => {
  //
  //     it('tabControllers should be have new controller', () => {
  //       const beforeControllersNum = getTabControllers().length
  //       dispatchCommand('atom-vim-like-tab:new')
  //
  //       expect(getTabControllers().length).toBeGreaterThan(beforeControllersNum)
  //     })
  //
  //     it('old pane should be hide', () => {
  //       dispatchCommand('atom-vim-like-tab:new')
  //
  //       const oldController = getFirstTabController()
  //
  //       expect(
  //         oldController.getPaneViews().every(
  //           (view) => view.style.display === 'none'
  //         )).toBe(true)
  //     })
  //
  //     it('new tabControllers should be have another pane', () => {
  //       const beforePanes = getFirstTabController().panes
  //       dispatchCommand('atom-vim-like-tab:new')
  //
  //       const newPane = _.first(getLastTabController().panes)
  //
  //       expect(beforePanes).not.toContain(newPane)
  //     })
  //
  //     it('new pane should be managed new tabContoller after new command', () => {
  //       dispatchCommand('atom-vim-like-tab:new')
  //       atom.workspace.getCenter().getActivePane().splitRight()
  //       const newPane = atom.workspace.getCenter().getActivePane()
  //
  //       const oldControllerPanes = getFirstTabController().panes
  //       const newControllerPanes = getLastTabController().panes
  //
  //       expect(oldControllerPanes).not.toContain(newPane)
  //
  //       expect(newControllerPanes).toContain(newPane)
  //     })
  //   })
  //
  //   describe('next', () => {
  //     beforeEach(() => {
  //       dispatchCommand('atom-vim-like-tab:new')
  //     })
  //
  //     it('current tab should be hide', () => {
  //       const beforeShowIndex = getMain().showIndex
  //       dispatchCommand('atom-vim-like-tab:next')
  //
  //       const previousController = getTabControllers()[beforeShowIndex]
  //
  //       expect(
  //         previousController.getPaneViews().every(
  //           (view) => view.style.display === 'none'
  //         )).toBe(true)
  //     })
  //
  //     it('next tab should be show', () => {
  //       dispatchCommand('atom-vim-like-tab:next')
  //       const showIndex = getMain().showIndex
  //       const nextController = getTabControllers()[showIndex]
  //
  //       expect(nextController.getPaneViews().every(
  //         (view) => view.style.display === ''
  //       )).toBe(true)
  //     })
  //
  //     it('next tab pane should be activated', () => {
  //       dispatchCommand('atom-vim-like-tab:next')
  //       const showIndex = getMain().showIndex
  //       const nextController = getTabControllers()[showIndex]
  //
  //       expect(nextController.panes[0]).toBe(atom.workspace.getCenter().getActivePane())
  //     })
  //   })
  //
  //   describe('close', () => {
  //     describe('when before create new tab', () => {
  //
  //       it('last TabController should not be removed', () => {
  //         const initController = getFirstTabController()
  //         dispatchCommand('atom-vim-like-tab:close')
  //
  //         expect(initController.panes).toHaveLength(1)
  //
  //         expect(getTabControllers()).toContain(initController)
  //       })
  //     })
  //
  //     describe('when after carete new tab', () => {
  //       let currentController = null
  //       beforeEach(() => {
  //         dispatchCommand('atom-vim-like-tab:new')
  //         currentController = getLastTabController()
  //
  //         dispatchCommand('atom-vim-like-tab:close')
  //
  //         // hack for pane.close() called by atom-vim-like-tab:close completly done.
  //         // because dispatchCommand() can't return promise.
  //         waitsForPromise(() => new Promise(resolve => setTimeout(resolve, 100)))
  //       })
  //
  //       it('current TabController should be removed', () => {
  //
  //         expect(currentController.panes).toHaveLength(0)
  //
  //         expect(getTabControllers()).not.toContain(currentController)
  //       })
  //
  //       it('previous panes should be show', () => {
  //         const showIndex = getMain().showIndex
  //         const previousController = getTabControllers()[showIndex]
  //
  //         expect(previousController.getPaneViews().every(
  //           (view) => view.style.display === ''
  //         )).toBe(true)
  //       })
  //
  //       it('previous tab pane should be activated', () => {
  //         const showIndex = getMain().showIndex
  //         const previousController = getTabControllers()[showIndex]
  //
  //         expect(previousController.panes[0]).toBe(atom.workspace.getCenter().getActivePane())
  //       })
  //     })
  //   })
  //
  //   describe('triggered by outside action', () => {
  //     describe('when all panes are closed', () => {
  //       it('unnecessary tabController should be removed', () => {
  //         // create new tab and then close all pane
  //         dispatchCommand('atom-vim-like-tab:new')
  //         const newController = getLastTabController()
  //         const closePromises = newController.panes.map((pane) => pane.close())
  //
  //         waitsForPromise(() => Promise.all(closePromises))
  //
  //         runs(() => {
  //           expect(getTabControllers()).not.toContain(newController)
  //         })
  //       })
  //     })
    // })
  // })
})
