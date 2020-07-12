# `contenteditable`

In this repository I play around with `contenteditable` to see what is the
minimal set of changes on top of the browser behavior needed to not make it like
complete and utter trash.

For my purposes, I primarily need a way to get clean and non-redundant HTML out
the editor. Even further, in my case, it is sufficient for this to be the text
of the editor and not its HTML. First step then is to develop a process which
non-destructively (content and selection wise) cleans the `contenteditable` HTML
in the editor element so that `textContent` and `innerText` (for line breaks)
provide useful values without ghost, missing or inconsistent blank lines etc.

As a bonus, sometimes I need to color or style some portions of my editor's
content for display, but not for storage. This means that working off the clean
HTML of the editor, I can patch it to introduce it my styling. This will get
lost on the next edit, but that's not a problem, because it can be simply
reapplied on each new edit since we have a guarantee of the clean and reliable
HTML coming in. The concern here is selection preservation.

I am also content with limiting this to caret selection as range selection is
much harder to take care of and less useful in my case as I can just ignore this
process when working with range selection and wait for the range to collapse to
a caret again and then do my magic. This is sufficient from UX perspective of my
needs.

## To-Do

### Remove useless `<br />` and `<div>`s which can be replaced with CSS

### Prototype highlighting / wrapping some portions with widgets on each edit

The useless HTML removal process will be simpler if it's made to remove pretty
much all HTML and just leave in the text and significant white-space, but the
wrappers and widgets can be reapplied after each run which should result in a
smooth experience across edits.
