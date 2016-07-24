# atom-vim-like-tab package [![Build Status](https://travis-ci.org/Kesin11/atom-vim-like-tab.svg?branch=master)](https://travis-ci.org/Kesin11/atom-vim-like-tab)

Add Vim like tab features in Atom

Create virtual window that can have multiple pane.
It enumerate vim tab features.

![atom-vim-like-tab.gif](https://raw.githubusercontent.com/Kesin11/atom-vim-like-tab/images/images/atom-vim-like-tab.gif)
![tab_list_view.png](https://raw.githubusercontent.com/Kesin11/atom-vim-like-tab/images/images/tab_list_view.png)

# Commands
- `atom-vim-like-tab:new`: crate new tab
- `atom-vim-like-tab:close`: close current tab
- `atom-vim-like-tab:previous`: show previous tab
- `atom-vim-like-tab:next`: show next tab
- `atom-vim-like-tab:list`: open tab select panel

# Keymap

No default keymaps.
Here is my example

```
'.editor.vim-mode-plus:not(.insert-mode)':
  't c': 'atom-vim-like-tab:new' # mean 'tab create'
  ': t a b c': 'atom-vim-like-tab:close'
  't p': 'atom-vim-like-tab:previous'
  't n': 'atom-vim-like-tab:next'
  'space t': 'atom-vim-like-tab:list'
```

# Future work
- [x] Add packages menu
- [x] Add list view feature for show and select tab
- [x] Always show how many tab and which is current tab. inspire by vim

# License
MIT
