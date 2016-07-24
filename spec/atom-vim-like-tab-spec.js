'use babel'

import * as path from 'path'
import {
  getMain,
  getTabControllers,
  getFirstTabController,
  getLastTabController,
  dispatchCommand,
} from './spec-helper.js'
import TabController from '../lib/tab_controller'
import _ from 'underscore-plus'

describe('AtomVimLikeTab', () => {
  beforeEach(() => {
    waitsForPromise(() => atom.workspace.open(path.join(__dirname, 'fixtures', 'dummy.txt')))
    waitsForPromise(() => atom.packages.activatePackage('atom-vim-like-tab'))
  })
  afterEach(() => {
    atom.packages.deactivatePackage('atom-vim-like-tab')
  })

  describe('activation', () => {
    describe('when activated', () => {
      it('has one tabContoller', () => {
        expect(getTabControllers()).toHaveLength(1)
        expect(getTabControllers()[0]).toBeInstanceOf(TabController)
      })
    })
    describe('when deactivated', () => {
      beforeEach(() => {
        atom.packages.deactivatePackage('atom-vim-like-tab')
      })
      it('subscriptions should be disposed', () => {
        expect(getMain().subscriptions.disposed).toBe(true)
      })
      it('tabControllers should be empty', () => {
        expect(getTabControllers()).toHaveLength(0)
      })
    })
  })

  describe('dispatch command', () => {
    describe('new', () => {
      it('tabControllers should be have new controller', () => {
        const beforeControllersNum = getTabControllers().length
        dispatchCommand('atom-vim-like-tab:new')

        expect(getTabControllers().length).toBeGreaterThan(beforeControllersNum)
      })
      it('old pane should be hide', () => {
        dispatchCommand('atom-vim-like-tab:new')

        const oldController = getFirstTabController()
        expect(
          oldController.getPaneViews().every(
            (view) => view.style.display === 'none'
          )).toBe(true)
      })
      it('new tabControllers should be have another pane', () => {
        const beforePanes = getFirstTabController().panes
        dispatchCommand('atom-vim-like-tab:new')

        const newPane = _.first(getLastTabController().panes)
        expect(beforePanes).not.toContain(newPane)
      })
      it('new pane should be managed new tabContoller after new command', () => {
        dispatchCommand('atom-vim-like-tab:new')
        atom.workspace.getActivePane().splitRight()
        const newPane = atom.workspace.getActivePane()

        const oldControllerPanes = getFirstTabController().panes
        const newControllerPanes = getLastTabController().panes
        expect(oldControllerPanes).not.toContain(newPane)
        expect(newControllerPanes).toContain(newPane)
      })
    })

    describe('next', () => {
      beforeEach(() => {
        dispatchCommand('atom-vim-like-tab:new')
      })
      it('current tab should be hide', () => {
        const beforeShowIndex = getMain().showIndex
        dispatchCommand('atom-vim-like-tab:next')

        const previousController = getTabControllers()[beforeShowIndex]
        expect(
          previousController.getPaneViews().every(
            (view) => view.style.display === 'none'
          )).toBe(true)
      })
      it('next tab should be show', () => {
        dispatchCommand('atom-vim-like-tab:next')
        const showIndex = getMain().showIndex

        const nextController = getTabControllers()[showIndex]
        expect(nextController.getPaneViews().every(
          (view) => view.style.display === ''
        )).toBe(true)
      })
      it('next tab pane should be activated', () => {
        dispatchCommand('atom-vim-like-tab:next')
        const showIndex = getMain().showIndex
        const nextController = getTabControllers()[showIndex]

        expect(nextController.panes[0]).toBe(atom.workspace.getActivePane())
      })
    })
    describe('close', () => {
      describe('when before create new tab', () => {
        it('last TabController should not be removed', () => {
          const initController = getFirstTabController()
          dispatchCommand('atom-vim-like-tab:close')

          expect(initController.panes).toHaveLength(1)
          expect(getTabControllers()).toContain(initController)
        })
      })
      describe('when after carete new tab', () => {
        beforeEach(() => {
          dispatchCommand('atom-vim-like-tab:new')
        })
        it('current TabController should be removed', () => {
          const currentController = getLastTabController()
          dispatchCommand('atom-vim-like-tab:close')

          expect(currentController.panes).toHaveLength(0)
          expect(getTabControllers()).not.toContain(currentController)
        })
        it('previous panes should be show', () => {
          dispatchCommand('atom-vim-like-tab:close')
          const showIndex = getMain().showIndex
          const previousController = getTabControllers()[showIndex]

          expect(previousController.getPaneViews().every(
            (view) => view.style.display === ''
          )).toBe(true)
        })
        it('previous tab pane should be activated', () => {
          dispatchCommand('atom-vim-like-tab:close')
          const showIndex = getMain().showIndex
          const previousController = getTabControllers()[showIndex]

          expect(previousController.panes[0]).toBe(atom.workspace.getActivePane())
        })
      })
    })

    describe('triggered by outside action', () => {
      describe('when all panes are closed', () => {
        it('unnecessary tabController should be removed', () => {
          // create new tab and then close all pane
          dispatchCommand('atom-vim-like-tab:new')
          const newController = getLastTabController()
          newController.panes.forEach((pane) => pane.close())

          expect(getTabControllers()).not.toContain(newController)
        })
      })
    })
  })
})
