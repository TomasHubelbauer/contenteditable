window.addEventListener('load', () => {
  const historyDiv = document.getElementById('historyDiv');
  const editorDiv = document.getElementById('editorDiv');
  editorDiv.addEventListener('input', handleEditorDivInput);
  editorDiv.focus();

  // Simulate the initial input
  document.execCommand('insertText', false, 'This div is content-editable. ');

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

    // Flatten the HTML structure
    // TODO: Do this recursively and keep track of whether the child is a direct descendant or not
    for (const element of editorElement.children) {
      const key = `${element.tagName.toLowerCase()}${[...element.attributes].map(a => ` ${a.name}=${a.value}`).join('')}`;
      switch (key) {
        case 'br': {
          // TODO: Try removing when in `div`, keep when direct child of the editor otherwise trailing space loss
          break;
        }
        case 'div': {
          // TODO: Do nothing?
          break;
        }
        default: {
          throw new Error(`Unexpected element ${key}.`);
        }
      }
    }
  }

  function log(/** @type {string} */ message) {
    const div = document.createElement('div');
    div.textContent = message;
    historyDiv.insertAdjacentElement('afterbegin', div);
  }

  function debug(/** @type {string} */ className) {
    const div = document.createElement('div');
    div.className = className;

    const innerHtmlDiv = document.createElement('div');
    innerHtmlDiv.textContent = JSON.stringify(editorDiv.innerHTML);
    div.append(innerHtmlDiv);

    const innerTextDiv = document.createElement('div');
    innerTextDiv.textContent = JSON.stringify(editorDiv.innerText);
    div.append(innerTextDiv);

    const textContentDiv = document.createElement('div');
    textContentDiv.textContent = JSON.stringify(editorDiv.textContent);
    div.append(textContentDiv);

    historyDiv.insertAdjacentElement('afterbegin', div);
  }

  function handleEditorDivInput() {
    log('Input!');
    try {
      debug('before');
      process(editorDiv);
      debug('after');
    }
    catch (error) {
      log(error.message);
    }
  }
});
