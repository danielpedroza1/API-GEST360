const selects = document.querySelectorAll('.status-select');

const getStatusText = value => {
    if (value === 'andamento') return 'EM ANDAMENTO';
    if (value === 'finalizado') return 'FINALIZADO';
    if (value === 'cancelado') return 'CANCELADO';
    return '';
};

const mudarCor = (event) => {
    const select = event.target;
    const row = select.closest('tr');
    if (!row) return;

    const statusCell = row.querySelector('.status');
    if (!statusCell) return;

    statusCell.textContent = getStatusText(select.value);
    statusCell.className = 'status ' + select.value;
};

selects.forEach((select) => {
    select.addEventListener('change', mudarCor);
});
