'use babel'

import _ from 'underscore-plus'

export function getMain() { return atom.packages.getLoadedPackage('atom-vim-like-tab').mainModule }
export function getTabControllers() { return getMain().tabControllers }
export function getFirstTabController() { return _.first(getTabControllers()) }
export function getLastTabController() { return _.last(getTabControllers()) }
export function dispatchCommand(command, element = atom.views.getView(atom.workspace)) {
  atom.commands.dispatch(element, command)
}
