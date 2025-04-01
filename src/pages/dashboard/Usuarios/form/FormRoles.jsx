import React from 'react'

const FormRoles = () => {
  return (
    <div>
        <form>
              <div className="mb-3">
                <label htmlFor="role_name" className="form-label">
                  Nombre del Rol
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="role_name"
                  placeholder="Administrador"
                />
              </div>
            
              <button type="submit" className="btn btn-primary">
                Crear Usuario
              </button>
            </form>
    </div>
  )
}

export default FormRoles