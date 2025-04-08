import React, { useEffect, useState } from 'react'
import './FormCategorias.scss';
import { errorAlert, successAlert } from '../../../../../helpers/alerts';
import HttpService from '../../../../../services/HttpService';
import Spinner from '../../../../../components/spinner/Spinner';

const FormCategorias = ({
  setEditDataCategories,
  editDataCategories,
  handleTabChange
  // setEditDataRoles,
}) => {

  const httpService = new HttpService();
  
  // useEffect(() => {
  //   setEditDataProducts({
  //     edit: false,
  //     productToEdit: null,
  //   });
  // }, []);

  useEffect(() => {
    if (editDataCategories.edit && editDataCategories.categorieToEdit) {
      const { name } = editDataCategories.categorieToEdit;
      setCategoryName(name || '');
    }
  }, [editDataCategories]);

  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState('');

  const HandleSubmit = async (e) => {

    e.preventDefault();

    // Validar el formulario
    if (!categoryName) {
      errorAlert('Error', 'El nombre del rol es obligatorio');
      return;
    }

    if (editDataCategories.edit) {
      // Si estamos editando un existente, llamamos a la función de actualización
      await updateData();
    } else {
      // Si estamos creando un nuevo, llamamos a la función de creación
      await postData();
    }



  }

  const postData = async () => {
    try {
      setLoading(true);
      const response = await httpService.postData('/category', { name: categoryName });
      if (response.status !== 201) {
        errorAlert('Error', 'No se pudo crear la categoría');
      } else {
        successAlert('Categría creada', `La categoría ${categoryName} ha sido creado exitosamente.`);
        // Reiniciar el formulario
        setCategoryName('');
        setEditDataCategories({
          edit: false,
          categorieToEdit: null,
        });

        // Cambiar a la pestaña de roles
        handleTabChange('categorias');
      } 

    } catch (error) {
      const { response } = error;
        errorAlert('Error', `${response.data.message || 'No se pudo crear la categoría. Por favor, inténtelo de nuevo.'}`);
        console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  

  const updateData = async () => {
    try {
      setLoading(true);
      const response = await httpService.putData('/category', editDataCategories.categorieToEdit.id, { name: categoryName });
      if (response.status !== 200) {
        errorAlert('Error', 'No se pudo actualizar el rol');
      } else {
        successAlert('Categoría actualizada', `La categoría ${categoryName} ha sido actualizado exitosamente.`);
        // Reiniciar el formulario
        setCategoryName('');
        setEditDataCategories({
          edit: false,
          categorieToEdit: null,
        });

        // Cambiar a la pestaña de roles
        handleTabChange('categorias');
      } 
    }catch (error) {
      const { response } = error;
        errorAlert('Error', `${response.data.message || 'No se pudo actualizar la categoría. Por favor, inténtelo de nuevo.'}`);
        console.error('Error:', error);
    } finally {
      setLoading(false);
    }

  }

console.log(editDataCategories)

  return (
    <div className="form_main_container">
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
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
              </div>
            
              {
                !loading ? (
                  <button type="submit" className="btn_submit" disabled={loading} onClick={HandleSubmit}>
                    {editDataCategories.edit ? 'Actualizar Categoría' : 'Crear Categoría'}
                  </button>
                ) : (
                  <div className="d-flex justify-content-center align-items-center mt-4">
                    <Spinner color="#6564d8" />
                  </div>
                )
              }
            </form>
    </div>
  )
}

export default FormCategorias