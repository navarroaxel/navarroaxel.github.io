const setCursorPosition = () => {
    const lines = t.value.substring(0, t.selectionEnd).split('\n');
    l.textContent = `${lines.length}:${lines[lines.length - 1].length}`
};
t.addEventListener('keyup', setCursorPosition);
t.addEventListener('mousedown', setCursorPosition);
t.addEventListener('mouseup', setCursorPosition);
