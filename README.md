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

## Findings

When there is only as single paragraph (prior to the first Enter key press),
`contenteditable` needs a `br` at the end to preserve trailing space (s?), if it
is removed, the trailing space (s?) will get trimmed. Therefore the trailing
`br` needs to be left intact when a direct child of the editor.

---

When there are multiple paragraphs, each one gets wrapped in a `div`, but each
also gets a `br` at the end like in the single-paragraph case. This `br` causes
`innerText` to report two newlines (`\n\n`), one for the `br` and one for the
end of the `div`.

This does not happen for the last `div` with `br` in it, that one reports just
one newline (`\n`) in `innerText`. If it is empty, the `innerText` will trail
with three newlines, two from the prior non-empty `div` and one for the `div`
which only has `br` in it. This is despite the editor not ending in three line
breaks, but in one.

These `br`s might be removable without the loss of the trailing space (s?) like
in the single-paragraph case.

## To-Do

### Prototype highlighting / wrapping some portions with widgets on each edit

The useless HTML removal process will be simpler if it's made to remove pretty
much all HTML and just leave in the text and significant white-space, but the
wrappers and widgets can be reapplied after each run which should result in a
smooth experience across edits.

### Test out removing the `br`s trailing paragraph `div`s to see if they matter

Perhaps they will be safe to remove without the loss of the trailing white-space
in those paragraph `div`s (if any) and that way no extra `\n` will appear in
`innerText`.

To do this, a recursive process over the descendants needs to be run and the
caret needs to be shifted each time the `br` is removed to keep the selection
stable.

### Consider not adjusting the `contenteditable` DOM structure only attributes

To keep the presentation stable (plain text input), we could actively remove
HTML attributes which we don't want (AKA pretty much all of them) and just
capture the HTML output of the editor knowing it is going to be clean. Then it
can be stored as HTML or parsed at the known controlled HTML subset and stored
in a different format (MarkDown?).
