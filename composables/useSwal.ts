export const useSwal = () => {
  const fire = async (options: any) => {
    if (process.client) {
      const Swal = (await import('sweetalert2')).default
      return Swal.fire({
        ...options,
        customClass: {
          popup: 'rounded-2xl font-sans',
          confirmButton: 'px-5 py-2.5 rounded-xl font-semibold text-white focus:outline-none transition-colors'
        }
      })
    }
  }

  const error = async (title: string, text: string) => {
    return fire({
      icon: 'error',
      title,
      text,
      confirmButtonColor: '#4f46e5', // Indigo 600
      confirmButtonText: 'Entendido'
    })
  }

  const success = async (title: string, text: string) => {
    return fire({
      icon: 'success',
      title,
      text,
      confirmButtonColor: '#4f46e5',
      confirmButtonText: 'Aceptar'
    })
  }

  return {
    fire,
    error,
    success
  }
}
