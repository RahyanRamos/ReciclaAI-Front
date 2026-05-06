$(function () {
    $('.remover').click(function (event) {
        event.preventDefault();

        const id = $(this).data('id');
        const name = $(this).data('name');
        const resource = $(this).data('resource');
        const label = $(this).data('label') || 'registro';

        Swal.fire({
            title: `Excluir ${label}?`,
            text: `Esta acao excluira "${name}" de forma permanente.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sim, excluir',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (!result.isConfirmed) {
                return;
            }

            try {
                const response = await fetch(`/${resource}/${id}/remover`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Falha ao excluir registro.');
                }

                Swal.fire({
                    title: 'Excluido',
                    text: `${name} foi removido com sucesso.`,
                    icon: 'success',
                    timer: 1800,
                    showConfirmButton: false,
                    willClose: () => location.reload()
                });
            } catch (error) {
                Swal.fire({
                    title: 'Nao foi possivel excluir',
                    text: error instanceof Error ? error.message : 'Tente novamente.',
                    icon: 'error'
                });
            }
        });
    });
});
