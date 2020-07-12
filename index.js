window.addEventListener('load', () => {
  const editorDiv = document.getElementById('editorDiv');
  editorDiv.addEventListener('input', handleEditorDivInput);

  const historyDiv = document.getElementById('historyDiv');

  handleEditorDivInput();

  function log(message) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    historyDiv.insertAdjacentElement('afterbegin', messageDiv);
    historyDiv.insertAdjacentElement('afterbegin', document.createElement('hr'));
  }

  function printRange(/** @type {Range} */ range) {
    const pairs = [];
    for (const key in range) {
      const type = typeof range[key];
      if (type === 'function') {
        continue;
      }

      const value = range[key];
      pairs.push(`${key} = ${value}`)
    }

    return pairs.join(' ');
  }

  function process(/** @type {HTMLElement} */ editorElement) {
    const selection = document.getSelection();

    // Check that the selection is in the editor (both its start and end if range not caret)
    if (!editorElement.contains(selection.anchorNode) || !editorElement.contains(selection.focusNode)) {
      throw new Error('Selection is not in the editor element.');
    }

    // Check we have a selection range (be it range or caret) for sanity
    if (selection.rangeCount === 0) {
      throw new Error('Selection has no ranges.');
    }

    // Ensure we only have a single selection range as multiple ranges are not supported at the moment
    if (selection.rangeCount !== 1) {
      throw new Error('Selection has multiple ranges.');
    }

    const range = selection.getRangeAt(0);

    // Check that the range does not span multiple nodes which is not supported at the moment
    if (range.startContainer !== range.endContainer) {
      throw new Error('Range spans multiple nodes.');
    }

    // Check that the range is collapsed because range selections are not supported at the moment
    if (!range.collapsed) {
      throw new Error('Range is not collapsed to a caret.');
    }

    // Remove <br> elements because they are redundant as <div> are also introduced when splitting lines
    // TODO: Do this recursively because splitting a line wraps existing into a div and introduces a new div with a br in it
    // TODO: Fix this also removing white space at the end of the content (which is separate from the <br>)
    // NOTE: Using replaceWith(' ') instead of remove does not solve this completely but makes it only happen once
    for (const element of editorElement.children) {
      if (element.tagName === 'BR') {
        element.remove();
      }
    }

    log(`Content: "${editorElement.innerHTML}"`);
  }

  function handleEditorDivInput() {
    try {
      process(editorDiv);
    }
    catch (error) {
      log(error.message);
    }
  }
});
