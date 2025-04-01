import Swal from 'sweetalert2'

export const successAlert = async (title = 'Success!', message = 'La operación se ha realizado con éxito') => {
  await Swal.fire({
    title: title,
    text: message,
    icon: 'success',
    confirmButtonText: 'Ok'
  })
}

export const errorAlert = async (title = 'Error!', message = 'Un error ha ocurrido') => {
  await Swal.fire({
    title: title,
    text: message,
    icon: 'error',
    confirmButtonText: 'Ok'
  })
}

export const warningAlert = async (title = 'Warning!', message = 'Advertencia') => {
    await Swal.fire({
        title: title,
        text: message,
        icon: 'warning',
        confirmButtonText: 'Ok'
    })
    }

export const timerAlert = async (title = 'Success!', message = 'La operación se ha realizado con éxito', timer = 2000) => {
  await Swal.fire({
    title: title,
    text: message,
    icon: 'success',
    timer: timer,
    timerProgressBar: true,
    showConfirmButton: false
  })
}

export const confirmAlert = async (title = 'Are you sure?', message = 'Are you sure you want to proceed?' , icon = 'warning') => {
  const result = await Swal.fire({
    title: title,
    text: message,
    icon: icon,
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  })
  return result.isConfirmed
}